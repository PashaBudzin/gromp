"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "~/i18n-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useDictionary } from "./dictionary-provider";

const localeDisplay = {
  en: "English 🇺🇸",
  uk: "Українська 🇺🇦",
};

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const dictionary = useDictionary();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Languages className="transition-all" />
            <span className="sr-only">
              {dictionary.navbar.locale_switch.change}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {i18n.locales.map((locale, i) => {
            return (
              <Link key={i} href={redirectedPathname(locale)}>
                <DropdownMenuItem>{localeDisplay[locale]}</DropdownMenuItem>
              </Link>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
