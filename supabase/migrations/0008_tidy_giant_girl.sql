CREATE TABLE "homestay_attachments_table" (
	"homestay_id" integer NOT NULL,
	"attachment_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "homestays_table" DROP CONSTRAINT "homestays_table_attachment_id_attachments_table_id_fk";
--> statement-breakpoint
ALTER TABLE "homestay_attachments_table" ADD CONSTRAINT "homestay_attachments_table_homestay_id_homestays_table_id_fk" FOREIGN KEY ("homestay_id") REFERENCES "public"."homestays_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homestay_attachments_table" ADD CONSTRAINT "homestay_attachments_table_attachment_id_attachments_table_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachments_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homestays_table" DROP COLUMN "attachment_id";