import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTablesData1741624462058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
