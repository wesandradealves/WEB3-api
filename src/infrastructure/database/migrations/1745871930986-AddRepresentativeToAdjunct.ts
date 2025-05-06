import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRepresentativeToAdjunct1745871930986 implements MigrationInterface {
  name = 'AddRepresentativeToAdjunct1745871930986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "adjuncts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "surname" character varying(100) NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "user_bdm_id" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "representative_id" uuid NOT NULL, CONSTRAINT "UQ_99705eb55629a569de82d2d452d" UNIQUE ("email"), CONSTRAINT "UQ_871148be49ea384710fc83cd65c" UNIQUE ("user_bdm_id"), CONSTRAINT "PK_8c7f93464e1b2185ef4520d354d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "adjuncts" ADD CONSTRAINT "FK_4f008df2fe252442fe108ff4af7" FOREIGN KEY ("representative_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "adjuncts" DROP CONSTRAINT "FK_4f008df2fe252442fe108ff4af7"`,
    );
    await queryRunner.query(`DROP TABLE "adjuncts"`);
  }
}
