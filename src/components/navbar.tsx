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
import Logo from "./logo";
import { useDictionary } from "./dictionary-provider";

export default function Navbar() {
  const dictionary = useDictionary();

  return (
    <nav className="bg-background/20 border-border sticky top-0 h-14 w-full border-b-2 border-dashed px-2 backdrop-blur-md md:px-4 lg:px-32">
      <div className="border-border flex gap-8 border-dashed py-2 lg:border-r-2 lg:border-l-2 lg:px-2">
        <Link className="border-border my-auto flex gap-2 px-2" href="/">
          <Logo className="my-auto h-10 w-11" />
          <p className="text my-auto hidden text-xl md:block">Gromp</p>
        </Link>
        <div className="my-auto hidden gap-4 lg:flex">
          <Link href="/city-prices" className="text-muted-foreground">
            {dictionary.navbar.city_prices}
          </Link>

          <Link href="/city-prices" className="text-muted-foreground">
            {dictionary.navbar.blog}
          </Link>
        </div>

        <div className="ml-auto flex gap-2">
          <Search />
          <div className="hidden gap-2 lg:flex">
            <ModeToggle />
            <LocaleSwitcher />
          </div>

          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}

function MobileNavbar() {
  const dictionary = useDictionary();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="lg:hidden"
          aria-label={dictionary.navbar.menu}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="pt-12 text-center">
        <SheetTitle></SheetTitle>
        <Separator />
        <Link href="/city-prices">{dictionary.navbar.city_prices}</Link>
        <Separator />
        <Link href="/city-prices">{dictionary.navbar.blog}</Link>
        <Separator />

        <SheetFooter>
          <div className="mx-auto flex gap-2">
            <LocaleSwitcher />
            <ModeToggle />
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
