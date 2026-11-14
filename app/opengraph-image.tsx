import { ImageResponse } from "next/og"

export const alt = "TechCollab - Connect. Collaborate. Create."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 48 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 20,
            background: "linear-gradient(90deg, #2563eb, #9333ea)",
            color: "white",
            fontSize: 44,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          TC
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#0f172a" }}>TechCollab</div>
      </div>
      <div style={{ fontSize: 80, fontWeight: 800, color: "#4f46e5", lineHeight: 1.1 }}>
        Connect. Collaborate. Create.
      </div>
      <div style={{ fontSize: 36, color: "#475569", marginTop: 32 }}>
        Freelance projects, tech events and developer communities in one place.
      </div>
    </div>,
    size,
  )
}
