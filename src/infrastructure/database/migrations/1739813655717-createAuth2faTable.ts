import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuth2faTable1739813655717 implements MigrationInterface {
    name = 'CreateAuth2faTable1739813655717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth-mfa" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "mfa" character varying NOT NULL, CONSTRAINT "PK_ae5a5a9a56f317ed79572d80d23" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auth-mfa"`);
    }

}
