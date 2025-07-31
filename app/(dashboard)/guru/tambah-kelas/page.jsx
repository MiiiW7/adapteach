"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Guru() {
  // Semua hooks useState harus di bagian paling atas
  const [allowed, setAllowed] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [kodeKelas, setKodeKelas] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'TEACHER') {
      setAllowed(true);
    } else {
      setAllowed(false);
    }
  }, []);

  if (allowed === false) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-3xl font-bold text-red-600">Akses tidak diizinkan untuk halaman ini.</h1>
      </main>
    );
  }
  if (allowed === null) return null;


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setKodeKelas('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat kelas');
      setSuccess('Kelas berhasil dibuat!');
      setKodeKelas(data.code);
      setForm({ title: '', description: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Tambah Kelas Baru</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow-md flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">Judul Kelas</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Contoh: Matematika Dasar"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium mb-1">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Deskripsi kelas..."
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Buat Kelas'}
        </Button>
        {success && <div className="text-green-600 font-semibold">{success} {kodeKelas && (<span>Kode Kelas: <span className="font-mono bg-gray-100 px-2 rounded">{kodeKelas}</span></span>)}</div>}
        {error && <div className="text-red-600 font-medium">{error}</div>}
      </form>
      <Link href="/guru" className="mt-6 text-blue-600 hover:underline">&larr; Kembali ke Dashboard Guru</Link>
    </div>
  );
}