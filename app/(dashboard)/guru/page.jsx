"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Guru() {
  const [allowed, setAllowed] = useState(null);
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Selamat datang kembali</h1>
      <Link href="/guru/tambah-kelas"><Button>Tambah Kelas</Button></Link>
    </div>
  );
}