import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { UserEntity } from '../entities/user.entity';

export class LoginUserDto implements Pick<UserEntity, 'passwordHash' | 'email'> {
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  passwordHash!: string;

  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}
