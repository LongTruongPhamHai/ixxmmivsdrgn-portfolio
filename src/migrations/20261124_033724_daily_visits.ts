import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "daily_visits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar NOT NULL,
  	"visits" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "daily_visits_id" integer;
  CREATE UNIQUE INDEX "daily_visits_date_idx" ON "daily_visits" USING btree ("date");
  CREATE INDEX "daily_visits_updated_at_idx" ON "daily_visits" USING btree ("updated_at");
  CREATE INDEX "daily_visits_created_at_idx" ON "daily_visits" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_daily_visits_fk" FOREIGN KEY ("daily_visits_id") REFERENCES "public"."daily_visits"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_daily_visits_id_idx" ON "payload_locked_documents_rels" USING btree ("daily_visits_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "daily_visits" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "daily_visits" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_daily_visits_fk";
  
  DROP INDEX "payload_locked_documents_rels_daily_visits_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "daily_visits_id";`)
}
