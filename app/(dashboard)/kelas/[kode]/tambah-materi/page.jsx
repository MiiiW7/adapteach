"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function TambahMateri() {
  // ...
  const handleClearMateri = () => {
    setResult(null);
    setTopik("");
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tambahMateriResult');
      localStorage.removeItem('tambahMateriTopik');
    }
  };
  // Restore preview from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tambahMateriResult');
      const savedTopik = localStorage.getItem('tambahMateriTopik');
      if (saved) setResult(JSON.parse(saved));
      if (savedTopik) setTopik(savedTopik);
    }
  }, []);
  const { kode } = useParams();
  const router = useRouter();
  const [topik, setTopik] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tambahMateriResult');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("http://localhost:5678/webhook-test/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topik }),
      });
      if (!res.ok) throw new Error("Gagal mengambil materi");
      const data = await res.json();
      console.log(data);
      setResult(data);
      localStorage.setItem('tambahMateriResult', JSON.stringify(data));
      localStorage.setItem('tambahMateriTopik', topik);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMateri = async (style) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Materi ${style.charAt(0).toUpperCase() + style.slice(1)} - ${topik}`,
          content: result[style],
          courseCode: kode,
          learningStyle: style
        }),
      });
      if (!res.ok) throw new Error("Gagal menambah materi");
      await res.json();
      alert(`Materi ${style} berhasil disimpan!`);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Materi (n8n Webhook)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="topik" className="block text-sm font-medium mb-2">Topik Materi</Label>
          <Input
            id="topik"
            value={topik}
            onChange={(e) => setTopik(e.target.value)}
            required
            disabled={loading}
            placeholder="Contoh: gravitasi"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Mengambil..." : "Ambil Materi"}
          </Button>
        </div>
      </form>

      <form onSubmit={handleSubmitMateri} className="space-y-4">
        {result && result.visual && result.auditori && result.kinestetik && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">Hasil Materi</h2>
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold mb-2">Visual</h3>
              <img src={result.visual} alt="Visual Materi" className="max-w-xs rounded shadow" />
              <Button onClick={() => handleSubmitMateri('visual')} type="button" className="mt-4">Tambah Materi Visual</Button>
            </div>
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold mb-2">Auditori</h3>
              <iframe
                width="350"
                height="200"
                src={result.auditori.replace("watch?v=", "embed/")}
                title="Auditori Materi"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <Button onClick={() => handleSubmitMateri('auditori')} type="button" className="mt-4">Tambah Materi Auditori</Button>
            </div>
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold mb-2">Kinestetik</h3>
              <p>{result.kinestetik}</p>
              <Button onClick={() => handleSubmitMateri('kinestetik')} type="button" className="mt-4">Tambah Materi Kinestetik</Button>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handleClearMateri} type="button" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                Clear Materi
              </Button>
            </div>
          </div>
        )}
      </form>

    </div>
  );
}