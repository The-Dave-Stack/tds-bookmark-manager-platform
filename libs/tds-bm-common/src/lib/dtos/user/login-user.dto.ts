import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { User } from '../../interfaces/user.interface.js';

export class LoginUserDto implements Pick<User, 'password' | 'email'> {
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}
