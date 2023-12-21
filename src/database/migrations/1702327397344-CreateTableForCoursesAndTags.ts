import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableForCoursesAndTags1702327397344
  implements MigrationInterface
{
  name = 'CreateTableForCoursesAndTags1702327397344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "courses_tags_tags" ("coursesId" uuid NOT NULL, "tagsId" uuid NOT NULL, CONSTRAINT "PK_002f62ec2f0a22dc90ee3f25d4b" PRIMARY KEY ("coursesId", "tagsId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d8199628c7f99576bdc8737f7a" ON "courses_tags_tags" ("coursesId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3a8605a1a1aef4816d6ef49fc5" ON "courses_tags_tags" ("tagsId") `
    );
    await queryRunner.query(
      `ALTER TABLE "courses_tags_tags" ADD CONSTRAINT "FK_d8199628c7f99576bdc8737f7ae" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "courses_tags_tags" ADD CONSTRAINT "FK_3a8605a1a1aef4816d6ef49fc57" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses_tags_tags" DROP CONSTRAINT "FK_3a8605a1a1aef4816d6ef49fc57"`
    );
    await queryRunner.query(
      `ALTER TABLE "courses_tags_tags" DROP CONSTRAINT "FK_d8199628c7f99576bdc8737f7ae"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3a8605a1a1aef4816d6ef49fc5"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d8199628c7f99576bdc8737f7a"`
    );
    await queryRunner.query(`DROP TABLE "courses_tags_tags"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
