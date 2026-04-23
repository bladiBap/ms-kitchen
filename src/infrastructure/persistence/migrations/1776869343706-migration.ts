import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1776869343706 implements MigrationInterface {
    name = 'Migration1776869343706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "measurement_unit" ("id" uuid NOT NULL, "name" character varying NOT NULL, "simbol" character varying NOT NULL, CONSTRAINT "PK_fc57e5fd5adea5a7009f99e140a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" uuid NOT NULL, "name" character varying NOT NULL, "measurementUnitId" uuid, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package_item" ("id" uuid NOT NULL, "quantity" integer NOT NULL, "recipeId" uuid NOT NULL, "packageId" uuid NOT NULL, CONSTRAINT "PK_b9830060b4e555fe0e1bd97b577" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calendar" ("id" uuid NOT NULL, "clientId" uuid NOT NULL, CONSTRAINT "PK_2492fb846a48ea16d53864e3267" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL, "date" date NOT NULL, "address" character varying NOT NULL, "reference" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "needsDelivery" boolean NOT NULL DEFAULT true, "calendarId" uuid NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_item_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" uuid NOT NULL, "status" "public"."order_item_status_enum" NOT NULL DEFAULT '0', "quantityPlanned" integer NOT NULL, "quantityPrepared" integer NOT NULL DEFAULT '0', "quantityDelivered" integer NOT NULL DEFAULT '0', "recipeId" uuid NOT NULL, "orderId" uuid NOT NULL, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL, "dateOrdered" date NOT NULL, "dateCreatedOn" date NOT NULL, "status" "public"."order_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."package_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "package" ("id" uuid NOT NULL, "code" character varying NOT NULL, "datePackage" date NOT NULL, "status" "public"."package_status_enum" NOT NULL DEFAULT '0', "orderId" uuid NOT NULL, "clientId" uuid NOT NULL, "addressId" uuid NOT NULL, CONSTRAINT "REL_f2910517fa70c5ebf0a073ee7c" UNIQUE ("addressId"), CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "daily_allocation" ("id" uuid NOT NULL, "date" date NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_509326493150db88ae350675208" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "allocation_line" ("id" uuid NOT NULL, "allocationId" uuid NOT NULL, "clientId" uuid NOT NULL, "recipeId" uuid NOT NULL, "quantityNeeded" integer NOT NULL, "quantityPackaged" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_87f7e78e6004c7b232efc4ccb12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client" ("id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "meal_plan" ("id" uuid NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "durationDays" integer NOT NULL, "calendarId" uuid, "clientId" uuid, CONSTRAINT "REL_5868e8024da2e6cdc4bf716ab5" UNIQUE ("calendarId"), CONSTRAINT "PK_b526e5597b340a2c47380a5033d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dayli_diet" ("id" uuid NOT NULL, "date" date NOT NULL, "nDayPlan" integer NOT NULL, "mealPlanId" uuid, CONSTRAINT "PK_b914639284df0b263e3f31e2c51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" uuid NOT NULL, "name" character varying NOT NULL, "instructions" character varying NOT NULL, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_ingredient" ("id" uuid NOT NULL, "quantity" integer NOT NULL, "recipeId" uuid, "ingredientId" uuid, CONSTRAINT "PK_a13ac3f2cebdd703ac557c5377c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "outbox_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" jsonb NOT NULL, "type" character varying NOT NULL, "created" TIMESTAMP NOT NULL, "processed" boolean NOT NULL DEFAULT false, "processedOn" TIMESTAMP, "correlationId" character varying, "traceId" character varying, "spanId" character varying, CONSTRAINT "PK_2f36ee5236f2793f3e7bd554589" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dayli_diet_recipes" ("dayliDietId" uuid NOT NULL, "recipeId" uuid NOT NULL, CONSTRAINT "PK_04464d35bb69d719e741eadb8e4" PRIMARY KEY ("dayliDietId", "recipeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f250249a5a5a9093862879c0c1" ON "dayli_diet_recipes" ("dayliDietId") `);
        await queryRunner.query(`CREATE INDEX "IDX_39e2bdc5f419788e468af62a10" ON "dayli_diet_recipes" ("recipeId") `);
        await queryRunner.query(`ALTER TABLE "ingredient" ADD CONSTRAINT "FK_594ce79856fe438d9938425674d" FOREIGN KEY ("measurementUnitId") REFERENCES "measurement_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package_item" ADD CONSTRAINT "FK_79b371667fbe8d59b1c4583bbd2" FOREIGN KEY ("packageId") REFERENCES "package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package_item" ADD CONSTRAINT "FK_e29a64c977f960e2895558a92da" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calendar" ADD CONSTRAINT "FK_3176e6465344d3a5c4467861b22" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_0eaf277374c498a9ce5378cb76b" FOREIGN KEY ("calendarId") REFERENCES "calendar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_7850f98130347caee87f7dff07c" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_2b0e0170cc17d9f9b45da3cb0bc" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_f2910517fa70c5ebf0a073ee7c9" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_9c6b298ffe8154e93752c13affd" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allocation_line" ADD CONSTRAINT "FK_06f94426c6bad90a4eec32b73ba" FOREIGN KEY ("allocationId") REFERENCES "daily_allocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allocation_line" ADD CONSTRAINT "FK_f4de4208a21eeeb68588625acf1" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allocation_line" ADD CONSTRAINT "FK_bf470cfbf210aa108484e5b1b56" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal_plan" ADD CONSTRAINT "FK_5868e8024da2e6cdc4bf716ab53" FOREIGN KEY ("calendarId") REFERENCES "calendar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal_plan" ADD CONSTRAINT "FK_065edaf7682fd232c51bb4b9c69" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dayli_diet" ADD CONSTRAINT "FK_d441e7a6e8bbc6e8fcf58413ae1" FOREIGN KEY ("mealPlanId") REFERENCES "meal_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_1ad3257a7350c39854071fba211" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_2879f9317daa26218b5915147e7" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dayli_diet_recipes" ADD CONSTRAINT "FK_f250249a5a5a9093862879c0c16" FOREIGN KEY ("dayliDietId") REFERENCES "dayli_diet"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dayli_diet_recipes" ADD CONSTRAINT "FK_39e2bdc5f419788e468af62a104" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dayli_diet_recipes" DROP CONSTRAINT "FK_39e2bdc5f419788e468af62a104"`);
        await queryRunner.query(`ALTER TABLE "dayli_diet_recipes" DROP CONSTRAINT "FK_f250249a5a5a9093862879c0c16"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_2879f9317daa26218b5915147e7"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_1ad3257a7350c39854071fba211"`);
        await queryRunner.query(`ALTER TABLE "dayli_diet" DROP CONSTRAINT "FK_d441e7a6e8bbc6e8fcf58413ae1"`);
        await queryRunner.query(`ALTER TABLE "meal_plan" DROP CONSTRAINT "FK_065edaf7682fd232c51bb4b9c69"`);
        await queryRunner.query(`ALTER TABLE "meal_plan" DROP CONSTRAINT "FK_5868e8024da2e6cdc4bf716ab53"`);
        await queryRunner.query(`ALTER TABLE "allocation_line" DROP CONSTRAINT "FK_bf470cfbf210aa108484e5b1b56"`);
        await queryRunner.query(`ALTER TABLE "allocation_line" DROP CONSTRAINT "FK_f4de4208a21eeeb68588625acf1"`);
        await queryRunner.query(`ALTER TABLE "allocation_line" DROP CONSTRAINT "FK_06f94426c6bad90a4eec32b73ba"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_9c6b298ffe8154e93752c13affd"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_f2910517fa70c5ebf0a073ee7c9"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_2b0e0170cc17d9f9b45da3cb0bc"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_7850f98130347caee87f7dff07c"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_0eaf277374c498a9ce5378cb76b"`);
        await queryRunner.query(`ALTER TABLE "calendar" DROP CONSTRAINT "FK_3176e6465344d3a5c4467861b22"`);
        await queryRunner.query(`ALTER TABLE "package_item" DROP CONSTRAINT "FK_e29a64c977f960e2895558a92da"`);
        await queryRunner.query(`ALTER TABLE "package_item" DROP CONSTRAINT "FK_79b371667fbe8d59b1c4583bbd2"`);
        await queryRunner.query(`ALTER TABLE "ingredient" DROP CONSTRAINT "FK_594ce79856fe438d9938425674d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39e2bdc5f419788e468af62a10"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f250249a5a5a9093862879c0c1"`);
        await queryRunner.query(`DROP TABLE "dayli_diet_recipes"`);
        await queryRunner.query(`DROP TABLE "outbox_message"`);
        await queryRunner.query(`DROP TABLE "recipe_ingredient"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TABLE "dayli_diet"`);
        await queryRunner.query(`DROP TABLE "meal_plan"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "allocation_line"`);
        await queryRunner.query(`DROP TABLE "daily_allocation"`);
        await queryRunner.query(`DROP TABLE "package"`);
        await queryRunner.query(`DROP TYPE "public"."package_status_enum"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TYPE "public"."order_item_status_enum"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "calendar"`);
        await queryRunner.query(`DROP TABLE "package_item"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
        await queryRunner.query(`DROP TABLE "measurement_unit"`);
    }

}
