export class UserWithoutPassword {
  id?: string;
  username!: string;
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

export class User extends UserWithoutPassword {
  password?: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}