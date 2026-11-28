import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "music_info_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "music_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "music_info_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "music_info_sources" ADD CONSTRAINT "music_info_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."music_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "music_info" ADD CONSTRAINT "music_info_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "music_info_locales" ADD CONSTRAINT "music_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."music_info"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "music_info_sources_order_idx" ON "music_info_sources" USING btree ("_order");
  CREATE INDEX "music_info_sources_parent_id_idx" ON "music_info_sources" USING btree ("_parent_id");
  CREATE INDEX "music_info_image_idx" ON "music_info" USING btree ("image_id");
  CREATE UNIQUE INDEX "music_info_locales_locale_parent_id_unique" ON "music_info_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "music_info_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "music_info" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "music_info_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "music_info_sources" CASCADE;
  DROP TABLE "music_info" CASCADE;
  DROP TABLE "music_info_locales" CASCADE;`)
}
