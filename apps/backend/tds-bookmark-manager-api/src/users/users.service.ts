import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ArrayContains, Like, Repository } from 'typeorm';

import { CreateUserDto, mapEntityToDto, User } from '@tds/tds-bm-common';
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

    let whereClause: any;

    if (dbType === 'postgres') {
      whereClause = { roles: ArrayContains(['ADMIN']) };
    } else {
      whereClause = { roles: Like('%ADMIN%') };
    }

    const adminCount = await this.usersRepository.count({ where: whereClause });

    return adminCount > 0;
  }

  async setupAdmin(createUserDto: CreateUserDto): Promise<User> {
    return await this.create({ ...createUserDto, roles: ['ADMIN'] });
  }

  findOneByEmail(data: Pick<User, 'email'>, options?: { withoutPassword: false }): Promise<UserEntity>;
  findOneByEmail(data: Pick<User, 'email'>, options?: { withoutPassword: true }): Promise<User>;
  async findOneByEmail(data: Pick<User, 'email'>, options?: { withoutPassword: boolean }): Promise<User | UserEntity> {
    const userEntity = await this.usersRepository.findOneBy({ email: data.email });

    this.logger.debug(`User with email '${data.email}' found: %o`, userEntity);
    if (!userEntity) {
      throw new NotFoundException(`User with mail '${data.email}' not found.`);
    }

    if (options?.withoutPassword === false) {
      return userEntity;
    }

    return mapEntityToDto<UserEntity, User>(userEntity, User);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async create(data: Partial<User>): Promise<User> {
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
      roles: data.roles || ['USER'],
    };
    return mapEntityToDto(await this.usersRepository.save(newUser), User);
  }

  async validateUserCredentials(credentials: Pick<User, 'email' | 'password'>): Promise<User | undefined> {
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

    return mapEntityToDto(userEntity, User);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
