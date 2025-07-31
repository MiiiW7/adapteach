"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailKelas() {
  const params = useParams();
  const kode = params.kode;
  const [kelas, setKelas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKelas = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/courses/${kode}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Kelas tidak ditemukan");
        setKelas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (kode) fetchKelas();
  }, [kode]);

  if (loading) return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-10 animate-pulse">
      <Skeleton className="h-8 w-2/3 mb-4" />
      <Skeleton className="h-5 w-24 mb-6" />
      <Skeleton className="h-6 w-full mb-6" />
      <Skeleton className="h-4 w-1/3 mb-8" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!kelas) return null;

  return (
    <>
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{kelas.title}</h1>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">Kode: {kelas.code}</span>
      </div>
      <div className="mb-6 text-gray-700 text-lg">{kelas.description}</div>
      <div className="text-sm text-gray-500">Dibuat: {new Date(kelas.createdAt).toLocaleDateString()}</div>
    </div>
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-10">
      <div className="flex items-center justify-center mb-4">
      <Link href={`/kelas/${kelas.code}/bahan-ajar`}>
        <Button>Tambah Bahan Ajar</Button>
      </Link>
      </div>
    </div>
    </>
  );
}
