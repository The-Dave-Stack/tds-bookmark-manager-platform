import { Expose } from "class-transformer";

export class UserWithoutPassword {
  @Expose()
  id?: string;

  @Expose()
  username!: string;

  @Expose()
  email!: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  isActive?: boolean;

  @Expose()
  roles!: Role[];

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  @Expose()
  lastLogin?: Date;

  @Expose()
  apiToken?: string;
}

export class User extends UserWithoutPassword {
  password?: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}