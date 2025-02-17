import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablesAuthAndUsers1739379109390 implements MigrationInterface {
    name = 'AlterTablesAuthAndUsers1739379109390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_96aac72f1574b88752e9fb00089"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cpf_cnpj"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passport"`);
        await queryRunner.query(`ALTER TABLE "auths" DROP COLUMN "user_market_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_bdm_id" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_1f585c8ad726c29695bc449205b" UNIQUE ("user_bdm_id")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "user_market_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "user_market_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_1f585c8ad726c29695bc449205b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_bdm_id"`);
        await queryRunner.query(`ALTER TABLE "auths" ADD "user_market_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "passport" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "cpf_cnpj" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_id" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_96aac72f1574b88752e9fb00089" UNIQUE ("user_id")`);
    }

}
