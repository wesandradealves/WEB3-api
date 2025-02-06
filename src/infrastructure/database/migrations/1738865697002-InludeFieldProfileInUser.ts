import { MigrationInterface, QueryRunner } from "typeorm";

export class InludeFieldProfileInUser1738865697002 implements MigrationInterface {
    name = 'InludeFieldProfileInUser1738865697002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profile" character varying NOT NULL DEFAULT 'USER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile"`);
    }

}
