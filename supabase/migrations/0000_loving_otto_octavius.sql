CREATE TABLE "bookings_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"homestay_id" integer NOT NULL,
	"check_in" timestamp NOT NULL,
	"check_out" timestamp NOT NULL,
	"total_price" integer NOT NULL,
	"food_selection" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'confirmed'
);
--> statement-breakpoint
CREATE TABLE "chats_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"host_id" integer NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homestays_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"host_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"location" jsonb NOT NULL,
	"price_per_night" integer NOT NULL,
	"amenities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rating" integer DEFAULT 0,
	"availability" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hosts_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"property_ids" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"homestay_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings_table" ADD CONSTRAINT "bookings_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings_table" ADD CONSTRAINT "bookings_table_homestay_id_homestays_table_id_fk" FOREIGN KEY ("homestay_id") REFERENCES "public"."homestays_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats_table" ADD CONSTRAINT "chats_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats_table" ADD CONSTRAINT "chats_table_host_id_hosts_table_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."hosts_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homestays_table" ADD CONSTRAINT "homestays_table_host_id_hosts_table_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."hosts_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hosts_table" ADD CONSTRAINT "hosts_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items_table" ADD CONSTRAINT "menu_items_table_homestay_id_homestays_table_id_fk" FOREIGN KEY ("homestay_id") REFERENCES "public"."homestays_table"("id") ON DELETE cascade ON UPDATE no action;