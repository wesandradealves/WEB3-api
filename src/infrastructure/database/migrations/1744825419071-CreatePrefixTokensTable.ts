import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePrefixTokensTable1744825419071 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prefix_tokens', true);

    await queryRunner.createTable(
      new Table({
        name: 'prefix_tokens',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'asset',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'maturity_time_days',
            type: 'integer',
          },
          {
            name: 'yield_percentage',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'hash',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'decimal_place',
            type: 'integer',
          },
          {
            name: 'yield_interval',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prefix_tokens');
  }
}
