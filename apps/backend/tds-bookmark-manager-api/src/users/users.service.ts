import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ArrayContains, MoreThan, Repository } from 'typeorm';

import { mapEntityToDto, Role, UserWithoutPassword, CreateUserDto } from '@tds/tds-bm-common';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(UsersService.name);
  }

  async hasAdmins(): Promise<boolean> {
    // TODO: Use a better approach
    const dbType = this.configService.get<string>('database.type');
    const databasePath = this.configService.get<string>('database.database');

    this.logger.debug(`${__dirname}: Database type: ${dbType}; Database path: ${databasePath}`);

    const adminCount = await this.usersRepository.count({ where: { roles: ArrayContains([Role.ADMIN]) } });

    return adminCount > 0;
  }

  async setupAdmin(createUserDto: CreateUserDto): Promise<User> {
    return await this.create({ ...createUserDto, roles: [Role.ADMIN] });
  }

  findOneByEmail(data: Pick<User, 'email'>, options?: { withoutPassword: false }): Promise<UserEntity>;
  findOneByEmail(data: Pick<User, 'email'>, options?: { withoutPassword: true }): Promise<UserWithoutPassword>;
  async findOneByEmail(data: Pick<User, 'email'>, options?: { withoutPassword: boolean }): Promise<UserWithoutPassword | UserEntity> {
    const userEntity = await this.usersRepository.findOneBy({ email: data.email });

    this.logger.debug(`User with email '${data.email}' found: %o`, userEntity);
    if (!userEntity) {
      throw new NotFoundException(`User with mail '${data.email}' not found.`);
    }

    if (options?.withoutPassword === false) {
      return userEntity;
    }

    return mapEntityToDto<UserEntity, UserWithoutPassword>(userEntity, UserWithoutPassword);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  /**
   * Finds all users and returns them without their password hash.
   * Intended for admin use.
   * @returns {Promise<UserWithoutPassword[]>}
   */
  async findAllForAdmin(): Promise<UserWithoutPassword[]> {
    this.logger.debug('Finding all users for admin panel');
    const users = await this.usersRepository.find();
    return users.map((user) => mapEntityToDto(user, UserWithoutPassword));
  }

  async findOneByApiToken(token: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ apiToken: token });
  }

  /**
   * Updates the roles of a specific user.
   * Prevents the last admin from having their ADMIN role removed.
   * @param {string} id - The ID of the user to update.
   * @param {Role[]} roles - The new array of roles.
   * @returns {Promise<UserWithoutPassword>} The updated user without password hash.
   */
  async updateRole(id: string, roles: Role[]): Promise<UserWithoutPassword> {
    this.logger.debug(`Attempting to update roles for user ID: ${id}`);
    const userToUpdate = await this.usersRepository.findOneBy({ id });
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    // Business logic: Prevent removing the last admin's role
    const isLosingAdminRole = userToUpdate.roles.includes(Role.ADMIN) && !roles.includes(Role.ADMIN);

    if (isLosingAdminRole) {
      const adminCount = await this.usersRepository.count({ where: { roles: ArrayContains([Role.ADMIN]) } });
      if (adminCount <= 1) {
        this.logger.warn(`Attempt to remove the last administrator role was blocked for user ID: ${id}`);
        throw new ForbiddenException('Cannot remove the last administrator role.');
      }
    }

    userToUpdate.roles = roles;
    const updatedUser = await this.usersRepository.save(userToUpdate);
    this.logger.info(`Successfully updated roles for user ID: ${id}`);
    return mapEntityToDto(updatedUser, UserWithoutPassword);
  }

  async create(data: Partial<CreateUserDto>): Promise<UserWithoutPassword> {
    const date = new Date();
    const newUser: UserEntity = {
      username: data.username as string,
      passwordHash: await this.hashPassword(data.password as string),
      email: data.email as string,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: true,
      createdAt: date,
      updatedAt: date,
      roles: data.roles || [Role.USER],
      apiToken: crypto.randomBytes(24).toString('hex'),
    };
    const savedUser = await this.usersRepository.save(newUser);
    this.logger.debug(`Successfully created user: %o`, savedUser);
    const userWithoutPassword = mapEntityToDto(savedUser, UserWithoutPassword);
    this.logger.debug(`Successfully created user without password: %o`, userWithoutPassword);
    return userWithoutPassword;
  }

  async createPasswordResetToken(email: string): Promise<string> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      // Do not reveal that the user does not exist
      this.logger.warn(`Password reset request for non-existent user: ${email}`);
      // In a real app you might return a dummy token or handle this differently
      // For now, we'll throw to indicate the issue in dev. In prod, you wouldn't.
      throw new NotFoundException('User not found.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // Token expires in 1 hour

    user.passwordResetToken = token;
    user.passwordResetExpires = expiryDate;
    await this.usersRepository.save(user);

    return token;
  }

  async resetUserPassword(token: string, newPass: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date()), // Check token is not expired
      },
    });

    if (!user) {
      throw new BadRequestException('Password reset token is invalid or has expired.');
    }

    user.passwordHash = await this.hashPassword(newPass);
    user.passwordResetToken = undefined; // Invalidate the token
    user.passwordResetExpires = undefined;

    return this.usersRepository.save(user);
  }

  async validateUserCredentials(credentials: Pick<User, 'email' | 'password'>): Promise<UserWithoutPassword | undefined> {
    let userEntity: UserEntity;
    try {
      userEntity = await this.findOneByEmail({ email: credentials.email }, { withoutPassword: false });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return undefined; // User not found, return undefined as per requirement
      }
      throw error; // Re-throw other exceptions
    }

    if (!(await this.comparePassword(credentials.password as string, userEntity.passwordHash))) {
      return undefined; // Invalid password
    }

    return mapEntityToDto(userEntity, UserWithoutPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
