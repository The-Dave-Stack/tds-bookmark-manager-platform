import { AdminController } from './admin.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module'; // Import UsersModule to use UsersService

@Module({
  imports: [UsersModule], // Make services from UsersModule available
  controllers: [AdminController],
})
export class AdminModule {}