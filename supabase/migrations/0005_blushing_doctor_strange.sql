ALTER TABLE "attachments_table" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "attachments_table" DROP COLUMN "entity_type";--> statement-breakpoint
ALTER TABLE "attachments_table" DROP COLUMN "entity_id";--> statement-breakpoint
ALTER TABLE "attachments_table" DROP COLUMN "file_name";