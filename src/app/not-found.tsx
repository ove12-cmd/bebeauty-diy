import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bb-notfound">
      <div className="bb-notfound__inner">
        <span className="bb-notfound__num">404</span>
        <h1 className="bb-notfound__title">Page not found</h1>
        <p className="bb-notfound__sub">This page is gone — like a crystal that fell off. 💎</p>
        <div className="bb-notfound__actions">
          <Button href="/">
            Back to homepage
          </Button>
          <Link href="/tooth-gem-kit" className="bb-notfound__shop">
            Shop products
          </Link>
        </div>
      </div>
    </div>
  );
}
