"use client";

import { type getDictionary } from "~/get-dictionary";
import Link from "next/link";
import Search from "./search";
import { ModeToggle } from "./theme-switcher";
import LocaleSwitcher from "./locale-switcher";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { getImageProps } from "next/image";
import Logo from "./logo";

export default function Navbar({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["navbar"];
}) {
  const common = { alt: "Logo", sizes: "100vw" };

  return (
    <nav className="bg-background/20 border-border sticky top-0 flex h-14 w-full gap-8 border-b-3 border-dotted px-2 py-2 backdrop-blur-md md:px-4 lg:px-32">
      <Link className="my-auto flex gap-2" href="/">
        <Logo className="my-auto h-10 w-11" />
        <p className="text my-auto hidden text-xl md:block">Gromp</p>
      </Link>
      <div className="my-auto hidden gap-4 lg:flex">
        <Link href="/city-prices" className="text-muted-foreground">
          {dictionary.city_prices}
        </Link>

        <Link href="/city-prices" className="text-muted-foreground">
          {dictionary.blog}
        </Link>
      </div>

      <div className="ml-auto flex gap-2">
        <Search dictionary={dictionary} />
        <div className="hidden gap-2 lg:flex">
          <ModeToggle dictionary={dictionary} />
          <LocaleSwitcher dictionary={dictionary} />
        </div>

        <MobileNavbar dictionary={dictionary} />
      </div>
    </nav>
  );
}

function MobileNavbar({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["navbar"];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="lg:hidden"
          aria-label={dictionary.menu}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="pt-12 text-center">
        <SheetTitle></SheetTitle>
        <Separator />
        <Link href="/city-prices">{dictionary.city_prices}</Link>
        <Separator />
        <Link href="/city-prices">{dictionary.blog}</Link>
        <Separator />

        <SheetFooter>
          <div className="mx-auto flex gap-2">
            <LocaleSwitcher dictionary={dictionary} />
            <ModeToggle dictionary={dictionary} />
            <Link href={"https://github.com/PashaBudzin/gromp"}>
              <Button variant={"outline"}>
                <SiGithub />
              </Button>
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
