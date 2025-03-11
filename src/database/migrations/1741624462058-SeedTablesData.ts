/**
 * This is a migration file that seeds data into the tables
 * Empty migration file was created with script command "migration:create ./src/database/migrations/SeedTablesData"
 * which generated a file with empty up and down methods
 * We can use TypeORM QueryBuilder to insert or delete data into the tables and more (check docs)
 */

import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostEntity } from '../entity/PostEntity';

export class SeedTablesData1741624462058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // TypeORM QueryBuilder
    const insertedUsers = await queryRunner.manager
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
      .returning('*')
      .execute();

    const populateAuthor = insertedUsers.raw[1] as string;

    const newPost1 = Object.assign(new PostEntity(), {
      title: 'The Cosmos',
      description: 'Exploring the cosmos and its mysteries.',
      text: 'Exploring the vastness of the cosmos, we uncover the mysteries of black holes, dark matter, and the origins of the universe. The journey through space reveals the wonders and enigmas that lie beyond our planet.',
      author: populateAuthor,
      tags: ['space', 'cosmos', 'black holes'],
      publishedAt: new Date(),
    });

    const newPost2 = Object.assign(new PostEntity(), {
      title: 'Galactic Secrets',
      description: "Unveiling the galaxy's secrets and wonders.",
      text: 'The secrets of the galaxy are hidden in the stars and planets that make up our universe. From the formation of galaxies to the potential for extraterrestrial life, the mysteries of the galaxy continue to captivate scientists and explorers alike.',
      author: populateAuthor,
      tags: [],
      publishedAt: new Date(),
    });

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('posts')
      .values([newPost1, newPost2])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Migration can be reverted with script command "migration:revert"
     * A migration table was created in the DB and lists all migrations that have been run
     * Above command reverts the last entry in the table. If last entry is related to this one,
     * it will revert the seed data in above up method
     */

    // First we need to delete posts, because of foreign key constraint error - relation to users in author column
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('posts')
      .where('title IN (:...titles)', {
        titles: ['The Cosmos', 'Galactic Secrets'],
      })
      .execute();

    // Then we can delete users, as relation to posts no longer exists
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
