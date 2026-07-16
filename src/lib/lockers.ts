export type Locker = {
  id: string;
  name: string;
  city: string;
  county: string;
  zip: string;
  lat: number;
  lng: number;
};

// Approximate centres of major Estonian towns — used to sort lockers
// nearest-first when the shopper types a recognised city (no geocoding needed).
export const CITY_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  tallinn: { lat: 59.437, lng: 24.7536 },
  tartu: { lat: 58.3776, lng: 26.729 },
  narva: { lat: 59.3776, lng: 28.1903 },
  pärnu: { lat: 58.3859, lng: 24.4971 },
  "kohtla-järve": { lat: 59.3986, lng: 27.2734 },
  viljandi: { lat: 58.3639, lng: 25.59 },
  rakvere: { lat: 59.3465, lng: 26.3558 },
  maardu: { lat: 59.4767, lng: 25.0247 },
  kuressaare: { lat: 58.2529, lng: 22.4853 },
  sillamäe: { lat: 59.3997, lng: 27.7636 },
  valga: { lat: 57.7772, lng: 26.0471 },
  võru: { lat: 57.8339, lng: 27.0194 },
  jõhvi: { lat: 59.3592, lng: 27.4213 },
  haapsalu: { lat: 58.9431, lng: 23.5414 },
  keila: { lat: 59.3036, lng: 24.4131 },
  paide: { lat: 58.8853, lng: 25.5573 },
  elva: { lat: 58.2225, lng: 26.4211 },
  saue: { lat: 59.3208, lng: 24.5517 },
  põlva: { lat: 58.0606, lng: 27.0694 },
  rapla: { lat: 58.9989, lng: 24.7928 },
  jõgeva: { lat: 58.7464, lng: 26.3936 },
  tapa: { lat: 59.2606, lng: 25.9578 },
  türi: { lat: 58.8085, lng: 25.4319 },
  otepää: { lat: 58.0594, lng: 26.4972 },
};

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function findCentroid(q: string): { lat: number; lng: number } | null {
  if (CITY_CENTROIDS[q]) return CITY_CENTROIDS[q];
  for (const [name, c] of Object.entries(CITY_CENTROIDS)) {
    if (q.includes(name) || name.includes(q)) return c;
  }
  return null;
}

/** Filter lockers by a free-text query (city / zip / name) and sort nearest-first. */
export function searchLockers(lockers: Locker[], query: string, limit = 30): Locker[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const matched = lockers.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.county.toLowerCase().includes(q) ||
      l.zip.includes(q),
  );
  const centroid = findCentroid(q);
  if (centroid) {
    matched.sort(
      (a, b) =>
        haversineKm(centroid.lat, centroid.lng, a.lat, a.lng) -
        haversineKm(centroid.lat, centroid.lng, b.lat, b.lng),
    );
  } else {
    matched.sort((a, b) => a.name.localeCompare(b.name, "et"));
  }
  return matched.slice(0, limit);
}
