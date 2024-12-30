ALTER TABLE "users_table" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "password" text NOT NULL;