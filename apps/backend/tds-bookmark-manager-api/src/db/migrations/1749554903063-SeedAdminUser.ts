import * as bcrypt from 'bcrypt';

import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { randomUUID } from 'crypto'; // Using Node.js built-in crypto module

// This migration is responsible for seeding the initial administrator user into the database.
// It's a data migration that reads credentials from environment variables.
export class SeedAdminUser1749554903063 implements MigrationInterface {
  name = 'SeedAdminUser1749554903063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Get admin credentials from environment variables ---
    // This allows for secure and flexible configuration in different environments (dev, staging, prod).
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log(
        `Skipping admin user seed: ADMIN_EMAIL or ADMIN_PASSWORD environment variables not set.`
      );
      return;
    }

    const userRepository = queryRunner.manager.getRepository(UserEntity);

    const adminExists = await userRepository.findOneBy({ email: adminEmail });

    if (adminExists) {
      console.log(
        `Admin user with email ${adminEmail} already exists. Skipping seed.`
      );
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    const adminUser = userRepository.create({
      id: randomUUID(), // Generate UUID in the application code.
      username: process.env.ADMIN_USERNAME || 'admin',
      firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
      lastName: process.env.ADMIN_LAST_NAME || 'User',
      email: adminEmail,
      passwordHash: passwordHash,
      roles: ['ADMIN','USER'], // Provide as an array.
      isActive: true,
    });
    console.log('ADMIN USER:', adminUser)

    const savedAdminUser = await userRepository.save(adminUser);
    console.log('SAVED ADMIN USER:', savedAdminUser)
    console.log(`Successfully seeded admin user: ${adminEmail}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This will run if you ever need to revert this specific migration.
    // It deletes the admin user created in the 'up' method based on the env var.
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await queryRunner.query(
        `DELETE FROM "users" WHERE "email" = $1 AND "role" = 'ADMIN'`,
        [adminEmail]
      );
    } else {
      console.log(
        `Skipping admin user down-migration because ADMIN_EMAIL environment variable is not set.`
      );
    }
  }
}
