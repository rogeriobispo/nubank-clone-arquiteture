import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAccounts1615800632858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'accountNumber',
            type: 'integer',
            generationStrategy: 'increment',
            isNullable: false,
            isGenerated: true,
          },
          {
            name: 'kind',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'personKind',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'balance',
            type: 'money',
            isNullable: false,
          },
          {
            name: 'overdraft',
            type: 'money',
            isNullable: false,
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts');
  }
}
