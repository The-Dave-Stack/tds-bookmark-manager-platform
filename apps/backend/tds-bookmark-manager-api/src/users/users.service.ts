import { Injectable } from '@nestjs/common';
import { UserEntity, UserEntityWithoutPassword } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: UserEntity[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme', // In a real app, hash passwords!
      email: 'john@test.com',
      isActive: true,
      createdAt: new Date(),
      roles: ['user'],
    },
    {
      userId: 2,
      username: 'admin',
      password: 'adminpassword', // In a real app, hash passwords!
      email: 'admin@test.com',
      isActive: true,
      createdAt: new Date(),
      roles: ['admin', 'user'],
    },
  ];

  async findOne(
    data: Pick<UserEntity, 'email'>,
    options: { withoutPassword: boolean } = { withoutPassword: true },
  ): Promise<UserEntity | UserEntityWithoutPassword | undefined> {
    return this._promisify(() => {
      const foundUser = this.users.find((user) => user.email === data.email);
      if (!foundUser) {
        return undefined;
      } else {
        if (options.withoutPassword) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = foundUser;
          return userWithoutPassword;
        } else {
          return foundUser;
        }
      }
    });
  }

  async findAll(): Promise<UserEntityWithoutPassword[]> {
    // Simulate a delay to mimic a real database call
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Return a copy of the users array to prevent external modifications
    return this._promisify(() => {
      return this.users.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    });
  }

  async create(data: Omit<UserEntity, 'userId' | 'isActive' | 'createdAt'>): Promise<UserEntityWithoutPassword> {
    const date = new Date();
    const newUser: UserEntity = {
      userId: this.users.length + 1, // From DB
      username: data.username,
      password: data.password, // In a real app, hash passwords!
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: true,
      createdAt: date,
      updatedAt: date,
      roles: data.roles ?? ['user'],
    };
    this.users.push(newUser);
    return this._promisify(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    });
  }

  private async _promisify<T>(fn: () => T): Promise<T> {
    return new Promise((resolve) => {
      resolve(fn());
    });
  }
}
