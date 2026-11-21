import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_locales" CASCADE;
  ALTER TABLE "posts" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "posts" ADD COLUMN "title" varchar;
  ALTER TABLE "posts" ADD COLUMN "content" jsonb NOT NULL;
  ALTER TABLE "posts" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "posts" ADD COLUMN "author" varchar;
  ALTER TABLE "posts" ADD COLUMN "series" varchar;
  ALTER TABLE "posts" ADD COLUMN "meaning" varchar;
  ALTER TABLE "posts" ADD COLUMN "cover_image_id" integer;
  ALTER TABLE "posts" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "posts_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_cover_image_id_media_id_fk";
  
  DROP INDEX "posts_cover_image_idx";
  ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "posts" DROP COLUMN "title";
  ALTER TABLE "posts" DROP COLUMN "content";
  ALTER TABLE "posts" DROP COLUMN "excerpt";
  ALTER TABLE "posts" DROP COLUMN "author";
  ALTER TABLE "posts" DROP COLUMN "series";
  ALTER TABLE "posts" DROP COLUMN "meaning";
  ALTER TABLE "posts" DROP COLUMN "cover_image_id";
  ALTER TABLE "posts" DROP COLUMN "featured";`)
}
