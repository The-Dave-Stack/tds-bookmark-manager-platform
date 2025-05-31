export type UserEntityWithoutPassword = Omit<UserEntity, 'password'>;
export class UserEntity {
  userId: number;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  roles: string[];
}
