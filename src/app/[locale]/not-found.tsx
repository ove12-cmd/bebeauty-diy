import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="bb-notfound">
      <div className="bb-notfound__inner">
        <span className="bb-notfound__num">404</span>
        <h1 className="bb-notfound__title">{t("title")}</h1>
        <p className="bb-notfound__sub">{t("sub")}</p>
        <div className="bb-notfound__actions">
          <Button href="/">
            {t("home")}
          </Button>
          <Link href="/tooth-gem-kit" className="bb-notfound__shop">
            {t("shop")}
          </Link>
        </div>
      </div>
    </div>
  );
}
