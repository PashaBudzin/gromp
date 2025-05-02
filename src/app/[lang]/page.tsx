import { getDictionary } from "../../get-dictionary";
import type { Locale } from "~/i18n-config";

export default async function IndexPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);

  return (
    <div>
      <div>{dictionary.hello}</div>
    </div>
  );
}
