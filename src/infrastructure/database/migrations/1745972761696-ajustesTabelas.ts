import { MigrationInterface, QueryRunner } from "typeorm";

export class AjustesTabelas1745972761696 implements MigrationInterface {
    name = 'AjustesTabelas1745972761696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."uploaded_files_status_enum" AS ENUM('UPLOADED', 'PROCESSING', 'PROCESSED')`);
        await queryRunner.query(`CREATE TABLE "uploaded_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "link" character varying NOT NULL, "status" "public"."uploaded_files_status_enum" NOT NULL DEFAULT 'UPLOADED', "user_id" character varying NOT NULL, "hash" character varying NOT NULL, CONSTRAINT "PK_e2d47e01bd5be386bf0067b2ed8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transfer_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "update_file_id" uuid NOT NULL, "asset" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "wallet" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "amount" numeric(10,2) NOT NULL, "obs" text, "status" "public"."transfer_assets_status_enum" NOT NULL DEFAULT 'PENDING', "uploaded_file_id" uuid, CONSTRAINT "PK_cada697e8f1b192811154a2d0d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transfer_assets" ADD CONSTRAINT "FK_6409b9b97a26f19219083d4cf65" FOREIGN KEY ("uploaded_file_id") REFERENCES "uploaded_files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer_assets" DROP CONSTRAINT "FK_6409b9b97a26f19219083d4cf65"`);
        await queryRunner.query(`DROP TABLE "transfer_assets"`);
        await queryRunner.query(`DROP TABLE "uploaded_files"`);
        await queryRunner.query(`DROP TYPE "public"."uploaded_files_status_enum"`);
    }

}
