import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1738862352894 implements MigrationInterface {
    name = 'InitialMigration1738862352894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "user_id" integer NOT NULL DEFAULT '0', "user_market_id" uuid NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_96aac72f1574b88752e9fb00089" UNIQUE ("user_id"), CONSTRAINT "UQ_4aa88f67834d23850d204c417b6" UNIQUE ("user_market_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auths" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "user_market_id" uuid NOT NULL, "refresh_token" character varying NOT NULL, CONSTRAINT "PK_22fc0631a651972ddc9c5a31090" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auths"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
