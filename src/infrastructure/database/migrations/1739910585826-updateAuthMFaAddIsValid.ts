import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAuthMFaAddIsValid1739910585826 implements MigrationInterface {
    name = 'UpdateAuthMFaAddIsValid1739910585826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth-mfa" ADD "is_valid" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth-mfa" DROP COLUMN "is_valid"`);
    }
}