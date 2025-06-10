import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findOne(
    data: Pick<UserEntity, 'email'>,
    options: { withoutPassword: boolean } = { withoutPassword: true },
  ): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email: data.email });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async create(data: Omit<UserEntity, 'id' | 'isActive' | 'createdAt'>): Promise<UserEntity> {
    const date = new Date();
    const newUser: UserEntity = {
      username: data.username,
      passwordHash: data.passwordHash, // TODO: Hash the password before saving
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: true,
      createdAt: date,
      updatedAt: date,
      roles: data.roles ?? ['user'],
    };
    return this.usersRepository.save(newUser);
  }

}
