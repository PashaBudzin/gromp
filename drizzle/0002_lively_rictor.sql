ALTER TABLE "gromp_records" ADD COLUMN "loyalty_price_UAH" numeric;--> statement-breakpoint
ALTER TABLE "gromp_records" ADD COLUMN "on_sale" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "gromp_records" ADD COLUMN "price_before_sale" numeric;