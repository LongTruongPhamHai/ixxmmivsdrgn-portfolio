import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tasks_status" AS ENUM('todo', 'doing', 'done', 'dropped');
  CREATE TYPE "public"."enum_tasks_priority" AS ENUM('low', 'normal', 'high');
  CREATE TABLE "tasks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"notes" varchar,
  	"status" "enum_tasks_status" DEFAULT 'todo' NOT NULL,
  	"priority" "enum_tasks_priority" DEFAULT 'normal',
  	"planned_for" varchar,
  	"original_date" varchar,
  	"carry_count" numeric DEFAULT 0,
  	"completed_at" timestamp(3) with time zone,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "daily_logs_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "daily_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar NOT NULL,
  	"review_wins" varchar,
  	"review_blockers" varchar,
  	"review_lessons" varchar,
  	"review_tomorrow" varchar,
  	"review_energy" numeric,
  	"rolled_over_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tasks_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "daily_logs_id" integer;
  ALTER TABLE "daily_logs_entries" ADD CONSTRAINT "daily_logs_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."daily_logs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tasks_status_idx" ON "tasks" USING btree ("status");
  CREATE INDEX "tasks_planned_for_idx" ON "tasks" USING btree ("planned_for");
  CREATE INDEX "tasks_updated_at_idx" ON "tasks" USING btree ("updated_at");
  CREATE INDEX "tasks_created_at_idx" ON "tasks" USING btree ("created_at");
  CREATE INDEX "daily_logs_entries_order_idx" ON "daily_logs_entries" USING btree ("_order");
  CREATE INDEX "daily_logs_entries_parent_id_idx" ON "daily_logs_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "daily_logs_date_idx" ON "daily_logs" USING btree ("date");
  CREATE INDEX "daily_logs_updated_at_idx" ON "daily_logs" USING btree ("updated_at");
  CREATE INDEX "daily_logs_created_at_idx" ON "daily_logs" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tasks_fk" FOREIGN KEY ("tasks_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_daily_logs_fk" FOREIGN KEY ("daily_logs_id") REFERENCES "public"."daily_logs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_tasks_id_idx" ON "payload_locked_documents_rels" USING btree ("tasks_id");
  CREATE INDEX "payload_locked_documents_rels_daily_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("daily_logs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tasks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "daily_logs_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "daily_logs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tasks" CASCADE;
  DROP TABLE "daily_logs_entries" CASCADE;
  DROP TABLE "daily_logs" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tasks_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_daily_logs_fk";
  
  DROP INDEX "payload_locked_documents_rels_tasks_id_idx";
  DROP INDEX "payload_locked_documents_rels_daily_logs_id_idx";
  ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN "api_key";
  ALTER TABLE "users" DROP COLUMN "api_key_index";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tasks_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "daily_logs_id";
  DROP TYPE "public"."enum_tasks_status";
  DROP TYPE "public"."enum_tasks_priority";`)
}
