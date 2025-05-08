import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPrefixToken1746718344777 implements MigrationInterface {
  name = 'AddPrefixToken1746718344777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prefix_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "asset" character varying(100) NOT NULL, "hash" character varying(255) NOT NULL, "maturity_time_days" integer NOT NULL, "yield_percentage" numeric(5,2) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "description" text, "decimal_place" integer NOT NULL, "yield_interval" integer, CONSTRAINT "UQ_13e3e67fa33b8d9c977d9afad51" UNIQUE ("hash"), CONSTRAINT "PK_979037e29b2a936232e126bbb2a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "prefix_tokens"`);
  }
}
