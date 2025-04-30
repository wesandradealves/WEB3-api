import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744309143157 implements MigrationInterface {
    name = 'Migrations1744309143157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "update-files" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."update-files_status_enum" AS ENUM('UPLOADED', 'PROCESSING', 'PROCESSED')`);
        await queryRunner.query(`ALTER TABLE "update-files" ADD "status" "public"."update-files_status_enum" NOT NULL DEFAULT 'UPLOADED'`);
        await queryRunner.query(`ALTER TABLE "dashboard_transfer_list" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."dashboard_transfer_list_status_enum" AS ENUM('PENDING', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`ALTER TABLE "dashboard_transfer_list" ADD "status" "public"."dashboard_transfer_list_status_enum" NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dashboard_transfer_list" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."dashboard_transfer_list_status_enum"`);
        await queryRunner.query(`ALTER TABLE "dashboard_transfer_list" ADD "status" character varying(50) NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "update-files" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."update-files_status_enum"`);
        await queryRunner.query(`ALTER TABLE "update-files" ADD "status" character varying NOT NULL DEFAULT 'UPLOADED'`);
    }

}
