import type { InferInsertModel } from "drizzle-orm";
import { records, type RecordInsert } from "~/server/db/schema";
import { products } from "~/server/db/schema";

export type ProductRecord = {
  priceUAH: number;
  loyaltyPriceUAH: number | null | undefined;
  priceBeforeSaleUAH: number | null | undefined;
  isOnSale: boolean;
  name: string;
  imageURL: string;
  storeId: number;
  link: string;
};

export interface StoreFetcher {
  fetch(): Promise<ProductRecord[]>;
}
