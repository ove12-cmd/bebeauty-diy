// Root-level fallback 404 — reachable outside the [locale] segment (e.g. an
// unmatched top-level path, or notFound() thrown outside any locale layout
// boundary), so it can't assume NextIntlClientProvider is in scope. Still
// rendered inside the root layout's <html>/<body> (this file must not add
// its own). Kept deliberately plain/English; the real in-locale 404 with
// translations and nav lives at app/[locale]/not-found.tsx.
export default function NotFound() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "80px 20px" }}>
      <h1>Page not found</h1>
      <p>
        <a href="/">Back to homepage</a>
      </p>
    </div>
  );
}
