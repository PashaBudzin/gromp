"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { useDictionary } from "~/components/dictionary-provider";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  ArrowDownAz,
  ArrowDownZa,
  ChevronDown,
  Gem,
  Percent,
} from "lucide-react";
import ProductCard from "~/components/product-card";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "~/components/ui/skeleton";

export default function IndexPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<
    "priceAsc" | "priceDesc" | "alphabetDesc" | "alphabetAsc"
  >("priceAsc");

  const dictionary = useDictionary().home_page;
  const currency = useDictionary().currency;

  const limit = 18;

  const { data, fetchNextPage, isLoading } =
    api.product.searchProducts.useInfiniteQuery(
      {
        query,
        limit,
        sort: sort,
      },
      {
        getNextPageParam: (_, pages) => pages.length * limit,
      },
    );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) void fetchNextPage();
  }, [inView, fetchNextPage]);
  return (
    <section className="min-h-[100vh]">
      <div className="grid grid-cols-6 gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="col-span-6 md:col-span-1">
              {dictionary.search.sorting}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{dictionary.search.sorting}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(v) =>
                setSort(
                  v as
                    | "priceAsc"
                    | "priceDesc"
                    | "alphabetDesc"
                    | "alphabetAsc",
                )
              }
            >
              <DropdownMenuRadioItem value="priceAsc">
                <Percent />
                {dictionary.search.price_asc}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="priceDesc">
                <Gem />
                {dictionary.search.price_desc}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="alphabetAsc">
                <ArrowDownAz />
                {dictionary.search.alphabet_asc}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="alphabetDesc">
                <ArrowDownZa />
                {dictionary.search.alphabet_desc}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          className="col-span-6 md:col-span-5"
          placeholder={dictionary.search_placeholder}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 justify-center md:grid-cols-2 xl:grid-cols-3">
        {data?.pages
          .flat()
          .map((p, i) => (
            <ProductCard
              price={p.latestPrice}
              pictureUrl={p.pictureUrl}
              isOnSale={!!p.latestIsOnSale}
              title={p.name}
              priceBeforeSale={p.latestPriceBeforeSale}
              currencySymbol={currency}
              productId={p.id}
              key={i}
              className="mx-auto"
            />
          ))}
        {isLoading ? (
          Array(3).map((_, i) => <Skeleton className="h-80 w-80" key={i} />)
        ) : (
          <></>
        )}
      </div>
      <div ref={ref} />
    </section>
  );
}
