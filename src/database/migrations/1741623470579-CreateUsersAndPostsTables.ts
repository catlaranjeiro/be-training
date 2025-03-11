import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersAndPostsTables1741623470579 implements MigrationInterface {
    name = 'CreateUsersAndPostsTables1741623470579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(25) NOT NULL, "description" character varying(50) NOT NULL, "text" text NOT NULL, "publishedAt" TIMESTAMP NOT NULL, "tags" text array, "authorId" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(30) NOT NULL, "lastName" character varying(30) NOT NULL, "email" citext NOT NULL, "password" character varying(50) NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
