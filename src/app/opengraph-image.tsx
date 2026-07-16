import { ImageResponse } from "next/og";

export const alt = "beBeauty DIY — hambakristalli komplekt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#111111",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            beBeauty
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
              background: "#c0962f",
              color: "#111111",
              padding: "6px 16px",
              borderRadius: 999,
            }}
          >
            DIY
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          Salongi tulemus, kodus 10 minutiga.
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 30, color: "#c0962f", fontWeight: 600 }}>
          Hambakristalli komplekt · Preciosa &amp; Primero
        </div>
      </div>
    ),
    size,
  );
}
