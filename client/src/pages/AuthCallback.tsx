import { useEffect, useState } from "react";

type MetaStatus = {
  connected: boolean;
  accounts?: Array<{ id: string; name: string }>;
};

export default function AuthCallback() {
  const [message, setMessage] = useState("Meta bağlantısı doğrulanıyor…");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error) {
      setMessage(`Meta bağlantısı tamamlanamadı: ${error}`);
      return;
    }

    fetch("/api/meta/status", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Bağlantı durumu alınamadı.");
        return (await response.json()) as MetaStatus;
      })
      .then((status) => {
        if (!status.connected) {
          setMessage("Meta dönüşü alındı ancak oturum bulunamadı. Lütfen tekrar deneyin.");
          return;
        }
        setOk(true);
        setMessage(`Meta başarıyla bağlandı. ${status.accounts?.length || 0} reklam hesabı bulundu.`);
      })
      .catch((cause: unknown) => {
        setMessage(cause instanceof Error ? cause.message : "Beklenmeyen bir hata oluştu.");
      });
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b1020", color: "#f8fafc", padding: 24 }}>
      <section style={{ maxWidth: 520, width: "100%", padding: 32, border: "1px solid #26334d", borderRadius: 20, background: "#111a2d" }}>
        <div style={{ fontSize: 13, color: ok ? "#34d399" : "#93c5fd", marginBottom: 12 }}>
          {ok ? "BAĞLANTI TAMAMLANDI" : "META ADS"}
        </div>
        <h1 style={{ fontSize: 26, margin: "0 0 12px" }}>{ok ? "Hesabın bağlandı" : "Facebook bağlantısı"}</h1>
        <p style={{ lineHeight: 1.6, color: "#cbd5e1", overflowWrap: "anywhere" }}>{message}</p>
        <a href="/" style={{ display: "inline-block", marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "#2563eb", color: "white", textDecoration: "none" }}>Uygulamaya dön</a>
      </section>
    </main>
  );
}
