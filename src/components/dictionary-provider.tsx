"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type getDictionary } from "~/get-dictionary";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

const DictionaryContext = createContext<Dictionary | undefined>(undefined);

export default function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error(
      "useNavbarDictionary must be used within NavbarDictionaryProvider",
    );
  }
  return context;
};
