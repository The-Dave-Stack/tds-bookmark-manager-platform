import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme', // In a real app, hash passwords!
      roles: ['user'],
    },
    {
      userId: 2,
      username: 'admin',
      password: 'adminpassword', // In a real app, hash passwords!
      roles: ['admin', 'user'],
    },
  ];

  findOne(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  create(username: string, password: string, roles: string[] = ['user']): User {
    const newUser: User = {
      userId: this.users.length + 1,
      username,
      password,
      roles,
    };
    this.users.push(newUser);
    return newUser;
  }
}
