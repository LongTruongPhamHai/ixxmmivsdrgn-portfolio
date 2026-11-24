import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_visibility" AS ENUM('public', 'archived', 'hidden');
  CREATE TYPE "public"."enum__posts_v_version_visibility" AS ENUM('public', 'archived', 'hidden');
  ALTER TABLE "posts" ADD COLUMN "visibility" "enum_posts_visibility" DEFAULT 'public';
  ALTER TABLE "_posts_v" ADD COLUMN "version_visibility" "enum__posts_v_version_visibility" DEFAULT 'public';
  CREATE INDEX "posts_visibility_idx" ON "posts" USING btree ("visibility");
  CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  CREATE INDEX "_posts_v_version_version_visibility_idx" ON "_posts_v" USING btree ("version_visibility");
  CREATE INDEX "_posts_v_version_version_published_at_idx" ON "_posts_v" USING btree ("version_published_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "posts_visibility_idx";
  DROP INDEX "posts_published_at_idx";
  DROP INDEX "_posts_v_version_version_visibility_idx";
  DROP INDEX "_posts_v_version_version_published_at_idx";
  ALTER TABLE "posts" DROP COLUMN "visibility";
  ALTER TABLE "_posts_v" DROP COLUMN "version_visibility";
  DROP TYPE "public"."enum_posts_visibility";
  DROP TYPE "public"."enum__posts_v_version_visibility";`)
}
