"use client";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IkutKelasDialog } from "./IkutKelasDialog";
import PilihGayaBelajar from "./PilihGayaBelajar";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Siswa() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("/api/my-courses", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data kelas");
      setCourses(data);
    } catch (err) {
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/user/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    const role = localStorage.getItem('role');
    if (role === 'STUDENT') {
      setAllowed(true);
      fetchCourses();
      fetchUser();
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
        <h1 className="text-4xl font-bold mb-8">Selamat Datang Kembali</h1>
        {user && !user.learningStyle && (
          <div className="mb-4">
            <Link href="/siswa/pilih-gaya-belajar">
              <Button variant="outline">Pilih Gaya Belajar</Button>
            </Link>
          </div>
        )}
        {user && user.learningStyle && (
          <div className="mb-4">
            <Link href="/siswa/pilih-gaya-belajar">
              <Button variant="outline">Ubah Gaya Belajar</Button>
            </Link>
          </div>
        )}
        <IkutKelasDialog onSukses={fetchCourses} />
        <div className="mt-10 w-full max-w-5xl">
          <h2 className="text-2xl font-semibold mb-4">Kelas yang Diikuti</h2>
          {loading ? (
            <div>Memuat...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : courses.length === 0 ? (
            <div>Belum ada kelas yang diikuti.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <Link key={course.id} href={`/dashboard/siswa/kelas/${course.id}`} className="hover:no-underline">
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
          )}
        </div>
      </main>
    </>
  );
}
