import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744307509862 implements MigrationInterface {
    name = 'Migrations1744307509862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "update-files" ALTER COLUMN "status" SET DEFAULT 'UPLOADED'`);
        await queryRunner.query(`ALTER TABLE "dashboard_transfer_list" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "auth-mfa" ALTER COLUMN "is_valid" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth-mfa" ALTER COLUMN "is_valid" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "dashboard_transfer_list" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "update-files" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
