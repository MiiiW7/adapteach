"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TambahKelasDialog } from "./TambahKelasDialog";

export default function Guru() {
  const [allowed, setAllowed] = useState(null);
  const [courses, setCourses] = useState([]);

  // Definisikan fetchCourses di sini agar bisa diakses dari mana saja
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengambil data kelas');
      setCourses(data);
    } catch (err) {
      setCourses([]);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'TEACHER') {
      setAllowed(true);
      fetchCourses();
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
      {/* Dialog Tambah Kelas */}
      <TambahKelasDialog onSukses={fetchCourses} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {courses.map(course => (
          <Link key={course.id} href={`/kelas/${course.code}`} className="hover:no-underline">
            <Card className="h-full flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-lg">
              <div>
                <div className="flex items-start justify-between px-6 pt-4">
                  <CardTitle>{course.title}</CardTitle>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono ml-2">Kode: {course.code}</span>
                </div>
                <CardDescription className="px-6 py-4 min-h-[48px] flex items-center">{course.description}</CardDescription>
              </div>
              <div className="px-6 pb-4 pt-2 mt-auto text-sm text-gray-500">Dibuat: {new Date(course.createdAt).toLocaleDateString()}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}