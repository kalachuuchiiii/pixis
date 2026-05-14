import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageColumnPdfName1778749449672 implements MigrationInterface {
    name = 'AddMessageColumnPdfName1778749449672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "pdf_name" character varying`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "UQ_2952595a5bec0052c5da0751cca" UNIQUE ("followerId", "followingId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "UQ_2952595a5bec0052c5da0751cca"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "pdf_name"`);
    }

}
