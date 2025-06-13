import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { mapEntityToDto, User } from '@tds/tds-bm-common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  findOneByEmail(data: Pick<User, 'email'>, options: { withoutPassword: false }): Promise<UserEntity>;
  findOneByEmail(data: Pick<User, 'email'>, options: { withoutPassword: true }): Promise<User>;
  async findOneByEmail(
    data: Pick<User, 'email'>,
    options?: { withoutPassword: boolean }
  ): Promise<User | UserEntity> {
    const userEntity = await this.usersRepository.findOneBy({ email: data.email });

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

  async create(data: Omit<User, 'id' | 'isActive' | 'createdAt' | 'roles'>): Promise<User> {
    const date = new Date();
    const newUser: UserEntity = {
      username: data.username,
      passwordHash: await this.hashPassword(data.password),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: true,
      createdAt: date,
      updatedAt: date,
      roles: ['USER'],
    };
    return mapEntityToDto(await this.usersRepository.save(newUser), User);
  }

  async validateUserCredentials(credentials: Pick<User, 'email' | 'password'>): Promise<User | undefined> {
    const userEntity = await this.findOneByEmail({ email: credentials.email }, { withoutPassword: false });

    if (!userEntity || !(await this.comparePassword(credentials.password, userEntity.passwordHash))) {
      return undefined;
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
