import { Card, CardContent, CardFooter } from "./ui/card";
import { cn } from "~/lib/utils";
import Link from "next/link";

export default function ProductCard(props: {
  title: string;
  pictureUrl: string | null;
  productId: number;
  price: string;
  isOnSale: boolean;
  priceBeforeSale: string | null;
  currencySymbol: string;
}) {
  return (
    <Link href={`/product/${props.productId}`}>
      <Card className="mt-10 w-80">
        <CardContent>
          <img
            src={props.pictureUrl ?? ""}
            alt={props.title}
            className="object-fit h-56 w-full rounded-xl bg-white"
          />
          <p className="mt-2 font-semibold">{props.title}</p>
        </CardContent>
        <CardFooter className="mt-auto justify-between text-lg">
          <p
            className={cn(
              "text-bold text-lg",
              props.isOnSale && "font-semibold text-red-500",
            )}
          >
            {props.price} {props.currencySymbol}
          </p>
          {props.isOnSale && (
            <p className="text-muted-foreground line-through">
              {props.priceBeforeSale} {props.currencySymbol}
            </p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
