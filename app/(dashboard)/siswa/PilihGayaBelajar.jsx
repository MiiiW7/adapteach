"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const OPTIONS = [
  { value: "VISUAL", label: "Visual" },
  { value: "AUDITORY", label: "Auditory" },
  { value: "KINESTHETIC", label: "Kinesthetic" },
];

export default function PilihGayaBelajar({ defaultValue, onSukses }) {
  const [selected, setSelected] = useState(defaultValue || "VISUAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/learning-style", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ learningStyle: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengupdate gaya belajar");
      setSuccess("Gaya belajar berhasil disimpan!");
      setTimeout(() => {
        window.location.href = "/siswa";
      }, 800);
      if (onSukses) onSukses(selected);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 bg-white rounded shadow space-y-6 mt-16">
      <h2 className="text-2xl font-bold mb-4 text-center">Pilih Gaya Belajar Anda</h2>
      <div className="text-center">
        <p className="text-sm text-gray-600">Test gaya belajar ini untuk memilih gaya belajar yang paling sesuai dengan Anda.</p>
        <p className="text-sm text-gray-600 cursor-pointer hover:underline"><a href="https://www.youtube.com/watch?v=9bZkp7q19f0" target="_blank">Tes Gaya belajar di sini.</a></p>
      </div>
      <div className="flex flex-col gap-4">
        {OPTIONS.map(opt => (
          <label key={opt.value} className={`flex items-center gap-3 p-3 border rounded cursor-pointer ${selected === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <input type="radio" name="learningStyle" value={opt.value} checked={selected === opt.value} onChange={() => setSelected(opt.value)} />
            <span className="font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
    </form>
  );
}
