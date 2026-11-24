import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "posts_locales" (
  	"meaning" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_meaning" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  -- keep existing (plain-text) meanings: one Lexical paragraph per line, stored as the Vietnamese version
  INSERT INTO "posts_locales" ("meaning", "_locale", "_parent_id")
  SELECT jsonb_build_object('root', jsonb_build_object(
           'type', 'root', 'version', 1, 'direction', 'ltr', 'format', '', 'indent', 0,
           'children', (
             SELECT jsonb_agg(jsonb_build_object(
                      'type', 'paragraph', 'version', 1, 'direction', 'ltr', 'format', '', 'indent', 0,
                      'textFormat', 0, 'textStyle', '',
                      'children', jsonb_build_array(jsonb_build_object(
                        'type', 'text', 'version', 1, 'text', l, 'format', 0,
                        'mode', 'normal', 'style', '', 'detail', 0)))
                    ORDER BY ord)
             FROM unnest(string_to_array(src."meaning", E'
')) WITH ORDINALITY AS lines(l, ord)
             WHERE length(trim(l)) > 0))),
         'vi', src."id"
  FROM "posts" src
  WHERE src."meaning" IS NOT NULL AND length(trim(src."meaning")) > 0;
  -- keep existing (plain-text) meanings: one Lexical paragraph per line, stored as the Vietnamese version
  INSERT INTO "_posts_v_locales" ("version_meaning", "_locale", "_parent_id")
  SELECT jsonb_build_object('root', jsonb_build_object(
           'type', 'root', 'version', 1, 'direction', 'ltr', 'format', '', 'indent', 0,
           'children', (
             SELECT jsonb_agg(jsonb_build_object(
                      'type', 'paragraph', 'version', 1, 'direction', 'ltr', 'format', '', 'indent', 0,
                      'textFormat', 0, 'textStyle', '',
                      'children', jsonb_build_array(jsonb_build_object(
                        'type', 'text', 'version', 1, 'text', l, 'format', 0,
                        'mode', 'normal', 'style', '', 'detail', 0)))
                    ORDER BY ord)
             FROM unnest(string_to_array(src."version_meaning", E'
')) WITH ORDINALITY AS lines(l, ord)
             WHERE length(trim(l)) > 0))),
         'vi', src."id"
  FROM "_posts_v" src
  WHERE src."version_meaning" IS NOT NULL AND length(trim(src."version_meaning")) > 0;
  ALTER TABLE "posts" DROP COLUMN "meaning";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meaning";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  ALTER TABLE "posts" ADD COLUMN "meaning" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meaning" varchar;`)
}
