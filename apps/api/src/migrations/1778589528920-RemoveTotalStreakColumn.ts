import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTotalStreakColumn1778589528920 implements MigrationInterface {
    name = 'RemoveTotalStreakColumn1778589528920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "streak" DROP COLUMN "total_streak"`);
        await queryRunner.query(`ALTER TABLE "streak" ALTER COLUMN "current_streak" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "streak" ALTER COLUMN "highest_streak" SET DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "streak" ALTER COLUMN "highest_streak" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "streak" ALTER COLUMN "current_streak" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "streak" ADD "total_streak" integer NOT NULL DEFAULT '0'`);
    }

}
