ALTER TABLE "gromp_product" ADD COLUMN "storeId" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "gromp_records" ADD COLUMN "price_UAH" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "gromp_product" ADD CONSTRAINT "gromp_product_storeId_name_unique" UNIQUE("storeId","name");