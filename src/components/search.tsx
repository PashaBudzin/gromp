import { Button } from "~/components/ui/button";
import { type getDictionary } from "~/get-dictionary";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Search as SearchGlass } from "lucide-react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useDictionary } from "./dictionary-provider";

export default function Search() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const randomInitialQuery = useMemo((): string => {
    const str = "абвгджзєкмнптфхц";

    return str[Math.round(Math.random() * (str.length - 1))] ?? "а";
  }, []);
  const dictionary = useDictionary().navbar;
  const [query, setQuery] = useState(randomInitialQuery);
  const [suggestions, setSuggestions] = useState<{ n: string; i: number }[]>(
    [],
  );

  const { data } = api.product.searchProducts.useQuery({
    query,
    limit: 20,
  });

  const selectOption = useCallback(
    (id: number, addSuggestion: boolean) => (v: string) => {
      setOpen(false);

      if (addSuggestion) {
        const d =
          z
            .array(z.object({ n: z.string(), i: z.number() }))
            .safeParse(
              JSON.parse(localStorage.getItem("recent_searches") ?? "[]"),
            ).data ?? [];

        localStorage.setItem(
          "recent_searches",
          JSON.stringify([{ i: id, n: v }, ...d.slice(0, 10)]),
        );
      }

      router.push(`/product/${id}`);
    },
    [setOpen],
  );

  useEffect(() => {
    setSuggestions(readSuggestions());

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  const readSuggestions = () => {
    if (!localStorage.getItem("recent_searches"))
      localStorage.setItem("recent_searches", "[]");
    const d =
      z
        .array(z.object({ n: z.string(), i: z.number() }))
        .safeParse(JSON.parse(localStorage.getItem("recent_searches") ?? "[]"))
        .data ?? [];

    return d;
  };

  return (
    <div>
      <Button
        variant={"outline"}
        className="text-muted-foreground pr-1"
        onClick={() => setOpen(true)}
      >
        <SearchGlass />
        {dictionary.search}
        <div className="bg-secondary text-muted-foreground hidden rounded-sm p-1 px-2 lg:block">
          <span className="text-xs">⌘</span>K
        </div>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={dictionary.search_placeholder}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {suggestions.length > 0 && (
            <CommandGroup heading={dictionary.search_suggestions}>
              {suggestions.map((item, i) => (
                <CommandItem key={i} onSelect={selectOption(item.i, false)}>
                  {item.n}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {data && data.length > 0 && (
            <CommandGroup heading={dictionary.search_results}>
              {data.map((item, i) => (
                <CommandItem key={i} onSelect={selectOption(item.id, true)}>
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
