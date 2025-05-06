CREATE TABLE "gromp_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"picture_url" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gromp_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"storeId" serial NOT NULL,
	"productId" serial NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gromp_stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "gromp_stores_name_unique" UNIQUE("name")
);
