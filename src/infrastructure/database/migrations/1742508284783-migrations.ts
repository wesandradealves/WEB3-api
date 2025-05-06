import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742508284783 implements MigrationInterface {
    name = 'Migrations1742508284783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "update-files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "link" character varying NOT NULL, "status" character varying NOT NULL, "user_id" character varying NOT NULL, "hash" character varying NOT NULL, CONSTRAINT "PK_8bb6d4da0c40f56bde49bf6bc1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dashboard_transfer_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "update_file_id" uuid NOT NULL, "asset" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "wallet" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "amount" numeric(10,2) NOT NULL, "obs" text, "status" character varying(50) NOT NULL, CONSTRAINT "PK_344274235aeda671f69f6a40257" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dashboard_transfer_list" ADD CONSTRAINT "FK_9688f7cddac0e955e6621097a79" FOREIGN KEY ("update_file_id") REFERENCES "update-files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dashboard_transfer_list" DROP CONSTRAINT "FK_9688f7cddac0e955e6621097a79"`);
        await queryRunner.query(`DROP TABLE "dashboard_transfer_list"`);
        await queryRunner.query(`DROP TABLE "update-files"`);
    }

}
