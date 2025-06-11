import { MigrationInterface, QueryRunner } from 'typeorm';

import { PinoLogger } from 'nestjs-pino';
import { getPinoLoggerOptions } from '../../logger/config';

const pinoLogger = new PinoLogger(getPinoLoggerOptions({ env: 'development', context: 'InitialSchema' }));

export class InitialSchema1749553974653 implements MigrationInterface {
  name = 'InitialSchema1749553974653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    pinoLogger.info(`Running migration '${this.name}' for DB_TYPE: '${process.env.DB_TYPE}'.`);
    switch (process.env.DB_TYPE) {
      case 'postgres':
        await queryRunner.query(
          `CREATE TABLE "folders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "parent_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "UQ_8e92b09a8f5a1b5bc2d232bfe25" UNIQUE ("user_id", "name", "parent_id"), CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
          `CREATE TABLE "bookmarks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" text NOT NULL, "title" text NOT NULL, "favicon_url" text, "click_count" integer NOT NULL DEFAULT '0', "last_clicked_at" TIMESTAMP, "is_hidden" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "folder_id" uuid, CONSTRAINT "PK_7f976ef6cecd37a53bd11685f32" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
          `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "api_token" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "last_login" TIMESTAMP, "roles" text NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_b0c7bff7a2c2f7f12d3a90b4f33" UNIQUE ("api_token"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
          `ALTER TABLE "folders" ADD CONSTRAINT "FK_71af7633de585b66b4db26734c9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
          `ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_58a0fbaee65cd8959a870ee678c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
          `ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_157b085ee88a9661be307fbd15f" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
        break;
      case 'sqlite':
      default:
        await queryRunner.query(
          `CREATE TABLE "folders" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "parent_id" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "user_id" varchar NOT NULL, CONSTRAINT "UQ_8e92b09a8f5a1b5bc2d232bfe25" UNIQUE ("user_id", "name", "parent_id"))`
        );
        await queryRunner.query(
          `CREATE TABLE "bookmarks" ("id" varchar PRIMARY KEY NOT NULL, "url" text NOT NULL, "title" text NOT NULL, "favicon_url" text, "click_count" integer NOT NULL DEFAULT (0), "last_clicked_at" datetime, "is_hidden" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "user_id" varchar NOT NULL, "folder_id" varchar)`
        );
        await queryRunner.query(
          `CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar(255) NOT NULL, "password_hash" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "first_name" varchar(255) NOT NULL, "last_name" varchar(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT (0), "api_token" varchar(255), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "last_login" datetime, "roles" text NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_b0c7bff7a2c2f7f12d3a90b4f33" UNIQUE ("api_token"))`
        );
        await queryRunner.query(
          `CREATE TABLE "temporary_folders" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "parent_id" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "user_id" varchar NOT NULL, CONSTRAINT "UQ_8e92b09a8f5a1b5bc2d232bfe25" UNIQUE ("user_id", "name", "parent_id"), CONSTRAINT "FK_71af7633de585b66b4db26734c9" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
        );
        await queryRunner.query(
          `INSERT INTO "temporary_folders"("id", "name", "parent_id", "created_at", "updated_at", "user_id") SELECT "id", "name", "parent_id", "created_at", "updated_at", "user_id" FROM "folders"`
        );
        await queryRunner.query(`DROP TABLE "folders"`);
        await queryRunner.query(`ALTER TABLE "temporary_folders" RENAME TO "folders"`);
        await queryRunner.query(
          `CREATE TABLE "temporary_bookmarks" ("id" varchar PRIMARY KEY NOT NULL, "url" text NOT NULL, "title" text NOT NULL, "favicon_url" text, "click_count" integer NOT NULL DEFAULT (0), "last_clicked_at" datetime, "is_hidden" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "user_id" varchar NOT NULL, "folder_id" varchar, CONSTRAINT "FK_58a0fbaee65cd8959a870ee678c" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_157b085ee88a9661be307fbd15f" FOREIGN KEY ("folder_id") REFERENCES "folders" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`
        );
        await queryRunner.query(
          `INSERT INTO "temporary_bookmarks"("id", "url", "title", "favicon_url", "click_count", "last_clicked_at", "is_hidden", "created_at", "updated_at", "user_id", "folder_id") SELECT "id", "url", "title", "favicon_url", "click_count", "last_clicked_at", "is_hidden", "created_at", "updated_at", "user_id", "folder_id" FROM "bookmarks"`
        );
        await queryRunner.query(`DROP TABLE "bookmarks"`);
        await queryRunner.query(`ALTER TABLE "temporary_bookmarks" RENAME TO "bookmarks"`);
        break;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    pinoLogger.info(`Running revert migration '${this.name}' for DB_TYPE: '${process.env.DB_TYPE}'.`);
    switch (process.env.DB_TYPE) {
      case 'postgres':
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_157b085ee88a9661be307fbd15f"`);
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_58a0fbaee65cd8959a870ee678c"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_71af7633de585b66b4db26734c9"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "bookmarks"`);
        await queryRunner.query(`DROP TABLE "folders"`);
        break;
      case 'sqlite':
      default:
        await queryRunner.query(`ALTER TABLE "bookmarks" RENAME TO "temporary_bookmarks"`);
        await queryRunner.query(
          `CREATE TABLE "bookmarks" ("id" varchar PRIMARY KEY NOT NULL, "url" text NOT NULL, "title" text NOT NULL, "favicon_url" text, "click_count" integer NOT NULL DEFAULT (0), "last_clicked_at" datetime, "is_hidden" boolean NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "user_id" varchar NOT NULL, "folder_id" varchar)`
        );
        await queryRunner.query(
          `INSERT INTO "bookmarks"("id", "url", "title", "favicon_url", "click_count", "last_clicked_at", "is_hidden", "created_at", "updated_at", "user_id", "folder_id") SELECT "id", "url", "title", "favicon_url", "click_count", "last_clicked_at", "is_hidden", "created_at", "updated_at", "user_id", "folder_id" FROM "temporary_bookmarks"`
        );
        await queryRunner.query(`DROP TABLE "temporary_bookmarks"`);
        await queryRunner.query(`ALTER TABLE "folders" RENAME TO "temporary_folders"`);
        await queryRunner.query(
          `CREATE TABLE "folders" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "parent_id" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "user_id" varchar NOT NULL, CONSTRAINT "UQ_8e92b09a8f5a1b5bc2d232bfe25" UNIQUE ("user_id", "name", "parent_id"))`
        );
        await queryRunner.query(
          `INSERT INTO "folders"("id", "name", "parent_id", "created_at", "updated_at", "user_id") SELECT "id", "name", "parent_id", "created_at", "updated_at", "user_id" FROM "temporary_folders"`
        );
        await queryRunner.query(`DROP TABLE "temporary_folders"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "bookmarks"`);
        await queryRunner.query(`DROP TABLE "folders"`);
    }
  }
}
