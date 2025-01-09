ALTER TABLE "attachments_table" ADD COLUMN "file_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "attachments_table" ADD COLUMN "file_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "attachments_table" ADD COLUMN "public_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "attachments_table" ADD COLUMN "uploaded_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "homestays_table" ADD COLUMN "attachment_id" integer;--> statement-breakpoint
ALTER TABLE "menu_items_table" ADD COLUMN "attachment_id" integer;--> statement-breakpoint
ALTER TABLE "homestays_table" ADD CONSTRAINT "homestays_table_attachment_id_attachments_table_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachments_table"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items_table" ADD CONSTRAINT "menu_items_table_attachment_id_attachments_table_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachments_table"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments_table" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "attachments_table" DROP COLUMN "content_type";--> statement-breakpoint
ALTER TABLE "attachments_table" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "attachments_table" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "homestays_table" DROP COLUMN "photos";