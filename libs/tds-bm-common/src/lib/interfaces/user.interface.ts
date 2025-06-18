export class User {
  username!: string;
  password?: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roles!: Role[];
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  apiToken?: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}