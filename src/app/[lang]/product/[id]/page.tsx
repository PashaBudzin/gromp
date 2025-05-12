import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PriceHistoryChartCard from "~/components/price-history-chart-card";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { type ChartConfig } from "~/components/ui/chart";
import { getDictionary } from "~/get-dictionary";
import type { Locale } from "~/i18n-config";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string; lang: Locale }>;
}) {
  const id = Number((await params).id);

  const d = await getDictionary((await params).lang);
  const dictionary = d.product_id;

  if (!id && id != 0) return notFound();

  const product = await api.product.getProductById({ id });

  const productLatestRecord = product?.records.sort((r) => +r.createdAt).at(-1);

  if (!productLatestRecord) return notFound();

  if (!product) return notFound();

  const chartData = (product ?? [])?.records.map((r) => ({
    date: new Date(r.createdAt),
    currentPrice: r.priceUAH,
    priceBeforeSale: r.priceBeforeSale,
    loyaltyPrice: r.loyaltyPriceUAH,
  }));

  const chartConfig = {
    currentPrice: {
      label: dictionary.chart.label_cur,
      color: "hsl(var(--chart-1))",
    },
    priceBeforeSale: {
      label: dictionary.chart.label_before_sale,
      color: "hsl(var(--chart-2))",
    },
    loyaltyPrice: {
      label: dictionary.chart.label_loyalty_price,
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 px-10 lg:grid-cols-2">
      <div className="w-full p-4">
        <img
          src={product.pictureUrl ?? ""}
          alt={product.name}
          className="w-full rounded-xl bg-white object-fill"
        />
      </div>

      <div className="w-full">
        <h1 className="mx-10 text-center text-2xl font-bold">{product.name}</h1>
        <Card className="mt-10 ml-auto w-full lg:w-2/3">
          <CardContent>
            <h2 className="text-xl font-semibold">
              {dictionary.card.buy_in_store} {product.store.name}
            </h2>
            <div className="mt-2 flex gap-10">
              <p
                className={cn(
                  "text-xl",
                  productLatestRecord.isOnSale && "font-bold text-red-500",
                )}
              >
                {productLatestRecord.priceUAH}
                {d.currency}
              </p>
              <p
                className={cn(
                  "hidden",
                  productLatestRecord.isOnSale &&
                    "text-muted-foreground block line-through",
                )}
              >
                {productLatestRecord.priceBeforeSale}
                {d.currency}
              </p>

              <p
                className={cn(
                  "text-primary-foreground bg-primary hidden rounded-lg p-1",
                  !!productLatestRecord.loyaltyPriceUAH && "block",
                )}
              >
                {productLatestRecord.loyaltyPriceUAH}
                {d.currency}
              </p>
            </div>
            <Link href={product.link}>
              <Button size={"lg"} className="mt-8 w-full">
                <ShoppingCart />
                {dictionary.card.buy}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <PriceHistoryChartCard chartConfig={chartConfig} chartData={chartData} />
    </div>
  );
}
