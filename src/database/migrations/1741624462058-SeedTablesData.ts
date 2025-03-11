/**
 * This is a migration file that seeds data into the tables
 * Empty migration file was created with script command "migration:create ./src/database/migrations/SeedTablesData"
 * which generated a file with empty up and down methods
 * We can use TypeORM QueryBuilder to insert or delete data into the tables and more (check docs)
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTablesData1741624462058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // TypeORM QueryBuilder
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users')
      .values([
        {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          password: '1234',
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@email.com',
          password: '1234',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Migration can be reverted with script command "migration:revert"
     * A migration table was created in the DB and lists all migrations that have been run
     * Above command reverts the last entry in the table. If last entry is related to this one, 
     * it will revert the seed data in above up method
     */
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('users')
      .where('email IN (:...emails)', {
        emails: ['john.smith@email.com', 'jane.smith@email.com'],
      })
      .execute();
  }
}
