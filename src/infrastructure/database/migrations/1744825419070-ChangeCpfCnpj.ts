import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCpfCnpj1744825419070 implements MigrationInterface {
  name = 'ChangeCpfCnpj1744825419070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth-mfa" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth-mfa" DROP COLUMN "deleted_at"`);
  }
}
