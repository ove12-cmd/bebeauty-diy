import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bb-notfound">
      <div className="bb-notfound__inner">
        <span className="bb-notfound__num">404</span>
        <h1 className="bb-notfound__title">Lehte ei leitud</h1>
        <p className="bb-notfound__sub">See leht on kadunud — nagu kristall, mis maha kukkus. 💎</p>
        <div className="bb-notfound__actions">
          <Button href="/" arrow>
            Tagasi avalehele
          </Button>
          <Link href="/hambakristalli-komplekt" className="bb-notfound__shop">
            Vaata tooteid
          </Link>
        </div>
      </div>
    </div>
  );
}
