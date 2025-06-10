/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { UserEntity } from '../entities/user.entity';

export class CreateUserDto implements Pick<UserEntity, 'username' | 'passwordHash' | 'email'> {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  passwordHash!: string;

  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}
