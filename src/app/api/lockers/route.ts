import type { Locker } from "@/lib/lockers";

const OMNIVA_URL = "https://www.omniva.ee/locations.json";

type OmnivaRow = Record<string, string>;

// Cache the upstream feed for a day (it changes rarely).
export const revalidate = 86400;

export async function GET() {
  try {
    const res = await fetch(OMNIVA_URL, { next: { revalidate } });
    if (!res.ok) throw new Error(`Omniva responded ${res.status}`);

    const raw = (await res.json()) as OmnivaRow[];
    const lockers: Locker[] = raw
      .filter((r) => r.TYPE === "0" && r.A0_NAME === "EE") // parcel machines in Estonia
      .map((r) => ({
        id: `${r.ZIP}-${r.NAME}`,
        name: r.NAME,
        city: r.A2_NAME || r.A1_NAME || "",
        county: r.A1_NAME || "",
        zip: r.ZIP || "",
        lat: parseFloat(r.Y_COORDINATE),
        lng: parseFloat(r.X_COORDINATE),
      }))
      .filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng));

    return Response.json(lockers, {
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    });
  } catch {
    return Response.json({ error: "Pakiautomaatide nimekiri pole hetkel saadaval." }, { status: 502 });
  }
}
