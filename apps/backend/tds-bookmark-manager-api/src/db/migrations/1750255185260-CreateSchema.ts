import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchema1750255185260 implements MigrationInterface {
    name = 'CreateSchema1750255185260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "password_reset_token" character varying(255), "password_reset_expires" TIMESTAMP, "email" character varying(255) NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "api_token" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "last_login" TIMESTAMP, "roles" text array NOT NULL DEFAULT '{USER}', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_b0c7bff7a2c2f7f12d3a90b4f33" UNIQUE ("api_token"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "folders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "parent_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "UQ_8e92b09a8f5a1b5bc2d232bfe25" UNIQUE ("user_id", "name", "parent_id"), CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bookmarks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" text NOT NULL, "title" text NOT NULL, "favicon_url" text, "click_count" integer NOT NULL DEFAULT '0', "last_clicked_at" TIMESTAMP, "is_hidden" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "folder_id" uuid, CONSTRAINT "PK_7f976ef6cecd37a53bd11685f32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_71af7633de585b66b4db26734c9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_58a0fbaee65cd8959a870ee678c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_157b085ee88a9661be307fbd15f" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_157b085ee88a9661be307fbd15f"`);
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_58a0fbaee65cd8959a870ee678c"`);
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_71af7633de585b66b4db26734c9"`);
        await queryRunner.query(`DROP TABLE "bookmarks"`);
        await queryRunner.query(`DROP TABLE "folders"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
