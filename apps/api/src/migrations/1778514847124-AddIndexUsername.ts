import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexUsername1778514847124 implements MigrationInterface {
    name = 'AddIndexUsername1778514847124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
    }

}
