import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // Export UsersService to be used in other modules (e.g., AuthModule)
})
export class UsersModule {}
