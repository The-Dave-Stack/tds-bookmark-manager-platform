/**
 * users.service.ts
 *
 * Purpose:
 * - Provides business logic and data access operations for user management.
 *
 * Logic Overview:
 * - Handles user creation, retrieval, role updates, password hashing, and password reset functionalities.
 * - Interacts with the `UserEntity` repository and integrates with caching and logging.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Inject } from '@nestjs/common';
import { ArrayContains, MoreThan, Repository } from 'typeorm';

import { mapEntityToDto, Role, UserWithoutPassword, User, CreateUserDto } from '@tds/tds-bm-common';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

/**
 * Service responsible for all user-related business logic and database interactions.
 * It handles operations such as user creation, retrieval, role management,
 * password hashing, and password reset processes.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(UsersService.name);
  }

  /**
   * Checks if there are any administrators in the system.
   * @returns {Promise<boolean>} True if at least one admin exists, false otherwise.
   */
  async hasAdmins(): Promise<boolean> {
    // TODO: Use a better approach
    const dbType = this.configService.get<string>('database.type');
    const databasePath = this.configService.get<string>('database.database');

    this.logger.debug(`${__dirname}: Database type: ${dbType}; Database path: ${databasePath}`);

    const adminCount = await this.usersRepository.count({ where: { roles: ArrayContains([Role.ADMIN]) } });

    return adminCount > 0;
  }

  /**
   * Sets up the first administrator user in the system.
   * This method is typically called during initial application setup.
   * @param {CreateUserDto} createUserDto - The data for creating the admin user.
   * @returns {Promise<UserWithoutPassword>} The created admin user, excluding sensitive data.
   */
  async setupAdmin(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    // TODO: move to utils
    this.cacheManager.stores.forEach(async (store: any) => {
      if (store.iterator) {
        for await (const [key, value] of store.iterator()) {
          this.logger.debug(`Cache key: ${key}, value: ${value}`);
        }
      }
    });
    // TODO: Maybe use a flag is better than checking the count?
    this.logger.info('Attempting to set up the first admin user');
    const adminUser = await this.create({ ...createUserDto, roles: [Role.ADMIN] });
    if (adminUser) {
      console.log('Cache KEYS:', this.cacheManager.stores.keys());
      this.logger.debug("Invalidating '/api/v1/users/checkAdmins' cache key.");
      await this.cacheManager.del('/api/v1/users/checkAdmins');
    }
    return adminUser;
  }

  /**
   * Finds a single user by their email address.
   * Overloaded to allow fetching with or without the password hash.
   * @param {Pick<User, 'email'>} data - Object containing the user's email.
   * @param {object} [options] - Options for the query.
   * @param {boolean} [options.withoutPassword] - If true, returns `UserWithoutPassword` DTO; otherwise, returns `UserEntity`.
   * @returns {Promise<UserEntity | UserWithoutPassword>} The found user entity or DTO.
   * @throws {NotFoundException} If no user is found with the given email.
   */
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

  /**
   * Retrieves all user entities from the database.
   * @returns {Promise<UserEntity[]>} An array of all user entities.
   */
  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  /**
   * Finds all users and returns them without their password hash.
   * Intended for admin use to display user lists securely.
   * @returns {Promise<UserWithoutPassword[]>} An array of user DTOs without sensitive data.
   */
  async findAllForAdmin(): Promise<UserWithoutPassword[]> {
    this.logger.debug('Finding all users for admin panel');
    const users = await this.usersRepository.find();
    return users.map((user) => mapEntityToDto(user, UserWithoutPassword));
  }

  /**
   * Finds a single user by their API token.
   * @param {string} token - The API token to search for.
   * @returns {Promise<UserEntity | null>} The found user entity or null if not found.
   */
  async findOneByApiToken(token: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ apiToken: token });
  }

  /**
   * Updates the roles of a specific user.
   * Prevents the last admin from having their ADMIN role removed to ensure system integrity.
   * @param {string} id - The ID of the user to update.
   * @param {Role[]} roles - The new array of roles to assign to the user.
   * @returns {Promise<UserWithoutPassword>} The updated user without password hash.
   * @throws {NotFoundException} If the user with the given ID is not found.
   * @throws {ForbiddenException} If an attempt is made to remove the last administrator role.
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

  /**
   * Creates a new user account.
   * Hashes the provided password and generates a unique API token for the user.
   * @param {Partial<CreateUserDto & Pick<User, 'roles'>>} data - The data for creating the user, including optional roles.
   * @returns {Promise<UserWithoutPassword>} The created user, excluding sensitive data.
   */
  async create(data: Partial<CreateUserDto & Pick<User, 'roles'>>): Promise<UserWithoutPassword> {
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

  /**
   * Generates a password reset token for a user and saves it with an expiration date.
   * @param {string} email - The email of the user requesting a password reset.
   * @returns {Promise<string>} The generated password reset token.
   * @throws {NotFoundException} If the user with the given email is not found.
   */
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

  /**
   * Resets a user's password using a valid reset token.
   * Invalidates the token after successful reset.
   * @param {string} token - The password reset token.
   * @param {string} newPass - The new password for the user.
   * @returns {Promise<UserEntity>} The updated user entity.
   * @throws {BadRequestException} If the token is invalid or has expired.
   */
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

  /**
   * Validates user login credentials (email and password).
   * @param {Pick<User, 'email' | 'password'>} credentials - The user's email and password.
   * @returns {Promise<UserWithoutPassword | undefined>} The user DTO if credentials are valid, otherwise undefined.
   */
  async validateUserCredentials(credentials: Pick<User, 'email' | 'password'>): Promise<UserWithoutPassword | undefined> {
    this.logger.debug(`[validateUserCredentials] Login attempt for the user: %o`, credentials);
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
      this.logger.error(`Invalid password for user: ${credentials.email}`);
      return undefined; // Invalid password
    }

    const loggedUser = mapEntityToDto(userEntity, UserWithoutPassword);
    this.logger.debug(`Successfully logged in user: %o`, loggedUser);
    return loggedUser;
  }

  /**
   * Hashes a plain text password using bcrypt.
   * @param {string} password - The plain text password to hash.
   * @returns {Promise<string>} The hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param {string} password - The plain text password.
   * @param {string} hash - The hashed password to compare against.
   * @returns {Promise<boolean>} True if the passwords match, false otherwise.
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
