import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

type OrderItem = { name: string; quantity: number; finalPrice: number };

type Order = {
  id: string;
  date: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  delivery: string;
  items: OrderItem[];
  total: number;
  currency: string;
};

function eur(n: number, currency: string) {
  return n.toFixed(2).replace(".", ",") + " " + currency;
}

async function getOrders(): Promise<Order[]> {
  const list = await stripe().paymentIntents.list({ limit: 100 });
  return list.data
    .filter((pi) => pi.status === "succeeded")
    .map((pi) => {
      const md = pi.metadata ?? {};
      let items: OrderItem[] = [];
      try {
        items = md.itemsJson ? JSON.parse(md.itemsJson) : [];
      } catch {
        /* ignore malformed metadata */
      }
      return {
        id: pi.id,
        date: new Date(pi.created * 1000).toLocaleString("et-EE"),
        reference: md.reference || pi.id,
        customerName: md.customerName || "—",
        customerEmail: pi.receipt_email || md.customerEmail || "—",
        customerPhone: md.customerPhone || "—",
        delivery: md.delivery || md.deliveryMethod || "—",
        items,
        total: (pi.amount_received ?? pi.amount ?? 0) / 100,
        currency: (pi.currency ?? "eur").toUpperCase(),
      };
    });
}

export default async function DashboardPage() {
  const authed = await verifySession();
  if (!authed) redirect("/dashboard/login");

  const orders = await getOrders();

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">Tellimused</h1>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
            >
              Logi välja
            </button>
          </form>
        </div>

        {orders.length === 0 ? (
          <p className="text-neutral-600">Tellimusi pole veel laekunud.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kuupäev</th>
                  <th className="px-4 py-3 font-semibold">Tellimus</th>
                  <th className="px-4 py-3 font-semibold">Klient</th>
                  <th className="px-4 py-3 font-semibold">Tooted</th>
                  <th className="px-4 py-3 font-semibold">Tarne</th>
                  <th className="px-4 py-3 text-right font-semibold">Summa</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-neutral-100 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{o.date}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-900">{o.reference}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900">{o.customerName}</div>
                      <div className="text-neutral-500">{o.customerEmail}</div>
                      <div className="text-neutral-500">{o.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {o.items.length > 0
                        ? o.items.map((it, i) => (
                            <div key={i}>
                              {it.name} × {it.quantity}
                            </div>
                          ))
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{o.delivery}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-neutral-900">
                      {eur(o.total, o.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
