import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldusername1739811178783 implements MigrationInterface {
    name = 'AddFieldusername1739811178783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auths" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auths" DROP COLUMN "username"`);
    }

}
