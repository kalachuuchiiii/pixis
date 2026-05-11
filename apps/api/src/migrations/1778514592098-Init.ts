import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778514592098 implements MigrationInterface {
    name = 'Init1778514592098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "credential" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying NOT NULL, CONSTRAINT "PK_3a5169bcd3d5463cefeec78be82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "point" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "current_points" integer NOT NULL DEFAULT '0', "highest_points" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_391f59a9491a08961038a615371" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "streak" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "current_streak" integer NOT NULL DEFAULT '0', "highest_streak" integer NOT NULL DEFAULT '0', "total_streak" integer NOT NULL DEFAULT '0', "last_action_timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dfb968d5a82b523a532bbf7cf70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."session_status_enum" AS ENUM('incomplete', 'completed', 'idle')`);
        await queryRunner.query(`CREATE TYPE "public"."session_mode_enum" AS ENUM('TIMED', 'NORMAL')`);
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."session_status_enum" NOT NULL DEFAULT 'idle', "mode" "public"."session_mode_enum" DEFAULT 'NORMAL', "started_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "stopped_at" TIMESTAMP WITH TIME ZONE, "total_points_gained" double precision NOT NULL DEFAULT '0', "accuracy" double precision NOT NULL DEFAULT '0', "user_id" uuid, "deck_id" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "flashcard_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_answer_correct" boolean NOT NULL, "sessionId" uuid, "user_id" uuid, "flashcard_id" uuid, "deck_id" uuid, CONSTRAINT "PK_2d6db376b5526cbeb9b9bbc1448" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."flashcard_type_enum" AS ENUM('open_ended', 'close_ended')`);
        await queryRunner.query(`CREATE TABLE "flashcard" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "type" "public"."flashcard_type_enum" NOT NULL DEFAULT 'close_ended', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "choices" text array, "is_answer_case_sensitive" boolean NOT NULL DEFAULT false, "deck_id" uuid, "user_id" uuid, CONSTRAINT "PK_e0aba0501d3bc532951efc9f791" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_saved_collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collectionId" uuid, "userId" uuid, CONSTRAINT "PK_0a8c62dbd5b0cdf1c6f86f81c3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying DEFAULT '', "visibility" character varying NOT NULL DEFAULT 'private', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "deck_count" integer NOT NULL DEFAULT '0', "color" character varying DEFAULT '#000000', "user_id" uuid, CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection_deck" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "collection_id" uuid, "deck_id" uuid, CONSTRAINT "PK_62ab700b841b2eb25aaea25ae96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_saved_deck" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "deck_id" uuid, CONSTRAINT "PK_63fab6867351be3effad66635a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deck" ("deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "flashcard_count" integer NOT NULL DEFAULT '0', "topic" text, "user_saved_deck_count" integer NOT NULL DEFAULT '0', "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "visibility" character varying NOT NULL DEFAULT 'private', "popularity_score" integer NOT NULL DEFAULT '0', "color" character varying DEFAULT '#000000', "user_id" uuid, CONSTRAINT "PK_99f8010303acab0edf8e1df24f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying DEFAULT '', "userId" uuid, CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."message_role_enum" AS ENUM('user', 'assistant')`);
        await queryRunner.query(`CREATE TABLE "message" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."message_role_enum" NOT NULL, "content" character varying NOT NULL DEFAULT '', "type" character varying NOT NULL, "set" jsonb, "userId" uuid, "conversationId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(26) NOT NULL, "nickname" character varying(26) DEFAULT '', "last_username_update" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_nickname_update" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "avatar_public_id" character varying, "avatar_url" character varying, "is_private" boolean DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "credential_id" uuid, "point_id" uuid, "streak_id" uuid, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "REL_12ba5f444da355e51efd7a1ff4" UNIQUE ("credential_id"), CONSTRAINT "REL_8cbdfb12d62030c7eac59d19dd" UNIQUE ("point_id"), CONSTRAINT "REL_ce8bf0fc8ab17ac1a3e022a599" UNIQUE ("streak_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_7c9634a218c5a65aca8dd0b6941" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcard_progress" ADD CONSTRAINT "FK_66180eb31c71965842945612bc5" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcard_progress" ADD CONSTRAINT "FK_f9a6d30a436783c7458fc747c1b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcard_progress" ADD CONSTRAINT "FK_ca1acac4480a1495f1b51a45033" FOREIGN KEY ("flashcard_id") REFERENCES "flashcard"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcard_progress" ADD CONSTRAINT "FK_72bfaa1d2686fa0bc5009026649" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcard" ADD CONSTRAINT "FK_85ba35183ea3d7b22dc6514b581" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcard" ADD CONSTRAINT "FK_d3612c2a1e9cae3c380b4d669a3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_saved_collection" ADD CONSTRAINT "FK_a1e2661f6f7c069c7454e382701" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_saved_collection" ADD CONSTRAINT "FK_e1259ba1cc25f180460cbc80370" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_4f925485b013b52e32f43d430f6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_deck" ADD CONSTRAINT "FK_a898e2ac3709a71fe4872651379" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_deck" ADD CONSTRAINT "FK_a9804f0fb5ca233f9168f662af7" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_deck" ADD CONSTRAINT "FK_5dcc9e80fd2b3c181a27dff9137" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_saved_deck" ADD CONSTRAINT "FK_e634b08c0f21d55fc2c9c85416f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_saved_deck" ADD CONSTRAINT "FK_3eb05f9fa305ea8109b19e786c2" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deck" ADD CONSTRAINT "FK_ed0def52a370eb424db27fc2b5b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_c308b1cd542522bb66430fa860a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_12ba5f444da355e51efd7a1ff4f" FOREIGN KEY ("credential_id") REFERENCES "credential"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8cbdfb12d62030c7eac59d19dd5" FOREIGN KEY ("point_id") REFERENCES "point"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ce8bf0fc8ab17ac1a3e022a599b" FOREIGN KEY ("streak_id") REFERENCES "streak"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ce8bf0fc8ab17ac1a3e022a599b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8cbdfb12d62030c7eac59d19dd5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_12ba5f444da355e51efd7a1ff4f"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_c308b1cd542522bb66430fa860a"`);
        await queryRunner.query(`ALTER TABLE "deck" DROP CONSTRAINT "FK_ed0def52a370eb424db27fc2b5b"`);
        await queryRunner.query(`ALTER TABLE "user_saved_deck" DROP CONSTRAINT "FK_3eb05f9fa305ea8109b19e786c2"`);
        await queryRunner.query(`ALTER TABLE "user_saved_deck" DROP CONSTRAINT "FK_e634b08c0f21d55fc2c9c85416f"`);
        await queryRunner.query(`ALTER TABLE "collection_deck" DROP CONSTRAINT "FK_5dcc9e80fd2b3c181a27dff9137"`);
        await queryRunner.query(`ALTER TABLE "collection_deck" DROP CONSTRAINT "FK_a9804f0fb5ca233f9168f662af7"`);
        await queryRunner.query(`ALTER TABLE "collection_deck" DROP CONSTRAINT "FK_a898e2ac3709a71fe4872651379"`);
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_4f925485b013b52e32f43d430f6"`);
        await queryRunner.query(`ALTER TABLE "user_saved_collection" DROP CONSTRAINT "FK_e1259ba1cc25f180460cbc80370"`);
        await queryRunner.query(`ALTER TABLE "user_saved_collection" DROP CONSTRAINT "FK_a1e2661f6f7c069c7454e382701"`);
        await queryRunner.query(`ALTER TABLE "flashcard" DROP CONSTRAINT "FK_d3612c2a1e9cae3c380b4d669a3"`);
        await queryRunner.query(`ALTER TABLE "flashcard" DROP CONSTRAINT "FK_85ba35183ea3d7b22dc6514b581"`);
        await queryRunner.query(`ALTER TABLE "flashcard_progress" DROP CONSTRAINT "FK_72bfaa1d2686fa0bc5009026649"`);
        await queryRunner.query(`ALTER TABLE "flashcard_progress" DROP CONSTRAINT "FK_ca1acac4480a1495f1b51a45033"`);
        await queryRunner.query(`ALTER TABLE "flashcard_progress" DROP CONSTRAINT "FK_f9a6d30a436783c7458fc747c1b"`);
        await queryRunner.query(`ALTER TABLE "flashcard_progress" DROP CONSTRAINT "FK_66180eb31c71965842945612bc5"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_7c9634a218c5a65aca8dd0b6941"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TYPE "public"."message_role_enum"`);
        await queryRunner.query(`DROP TABLE "conversation"`);
        await queryRunner.query(`DROP TABLE "deck"`);
        await queryRunner.query(`DROP TABLE "user_saved_deck"`);
        await queryRunner.query(`DROP TABLE "collection_deck"`);
        await queryRunner.query(`DROP TABLE "collection"`);
        await queryRunner.query(`DROP TABLE "user_saved_collection"`);
        await queryRunner.query(`DROP TABLE "flashcard"`);
        await queryRunner.query(`DROP TYPE "public"."flashcard_type_enum"`);
        await queryRunner.query(`DROP TABLE "flashcard_progress"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TYPE "public"."session_mode_enum"`);
        await queryRunner.query(`DROP TYPE "public"."session_status_enum"`);
        await queryRunner.query(`DROP TABLE "streak"`);
        await queryRunner.query(`DROP TABLE "point"`);
        await queryRunner.query(`DROP TABLE "credential"`);
    }

}
