import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { TRACKING_SCRIPTS, type TrackingScriptLocation } from "@/lib/tracking-scripts";

export const metadata: Metadata = {
  title: "Jälgimiskoodid",
  robots: { index: false, follow: false },
};

const LOCATION_LABELS: Record<TrackingScriptLocation, string> = {
  head: "<head>",
  "body-start": "<body> algus",
  "body-end": "<body> lõpp",
};

export default async function TrackingCodesPage() {
  const authed = await verifySession();
  if (!authed) redirect("/dashboard/login");

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">Jälgimiskoodid</h1>
          <Link
            href="/dashboard"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
          >
            Tellimused
          </Link>
        </div>

        {TRACKING_SCRIPTS.length === 0 ? (
          <p className="text-neutral-600">
            Ühtegi jälgimiskoodi ei ole veel lisatud. Saada kood vestluses ja see lisatakse siia.
          </p>
        ) : (
          <div className="space-y-4">
            {TRACKING_SCRIPTS.map((script) => (
              <div key={script.id} className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-neutral-900">{script.name}</h2>
                  <span className="whitespace-nowrap rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                    {LOCATION_LABELS[script.location]}
                  </span>
                </div>
                <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100">
                  <code>{script.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
