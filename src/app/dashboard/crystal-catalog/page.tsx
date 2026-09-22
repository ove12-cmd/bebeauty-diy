import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import CrystalCatalog from "@/components/dashboard/CrystalCatalog";

export const metadata: Metadata = {
  title: "Kristallikataloog",
  robots: { index: false, follow: false },
};

export default async function CrystalCatalogPage() {
  const authed = await verifySession();
  if (!authed) redirect("/dashboard/login");

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">Kristallikataloog</h1>
          <Link
            href="/dashboard"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
          >
            Tellimused
          </Link>
        </div>
        <CrystalCatalog />
      </div>
    </main>
  );
}
