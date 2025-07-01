ALTER TABLE "links" RENAME COLUMN "short_url" TO "slug";--> statement-breakpoint
DROP INDEX "short_url_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "slug_idx" ON "links" USING btree ("slug");