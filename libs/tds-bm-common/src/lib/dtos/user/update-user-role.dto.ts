import { IsArray, IsEnum } from 'class-validator';

import { Role } from '../../interfaces/user.interface.js';

export class UpdateUserRoleDto {
  @IsArray()
  @IsEnum(Role, { each: true })
  roles!: Role[];
}