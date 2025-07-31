"use client";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Siswa() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(null);
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'STUDENT') {
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
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-7xl font-bold">Welcome to Siswa</h1>
      </main>
    </>
  );
}
