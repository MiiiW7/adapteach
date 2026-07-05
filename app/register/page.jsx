"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registrasi gagal');
      
      setSuccess('Registrasi berhasil! Mengalihkan ke dashboard...');
      
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user && data.user.role) localStorage.setItem('role', data.user.role);

      setTimeout(() => {
        if (data.user && data.user.role === 'STUDENT') {
          router.replace('/siswa');
        } else if (data.user && data.user.role === 'TEACHER') {
          router.replace('/guru');
        } else {
          router.replace('/');
        }
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side: branding/banner (visible on lg screens) */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 p-12 text-white relative overflow-hidden">
        {/* background patterns */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base">
            A
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Adap<span className="text-indigo-400">Teach</span>
          </span>
        </div>

        <div className="space-y-6 z-10 max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Mulai Perjalanan Belajar Adaptif Anda.
          </h2>
          <p className="text-slate-400 text-lg">
            Bergabunglah dengan ribuan siswa dan guru untuk merasakan pengalaman belajar yang disesuaikan secara khusus.
          </p>
        </div>

        <div className="text-xs text-slate-500 z-10">
          © {new Date().getFullYear()} AdaptEach. All rights reserved.
        </div>
      </div>

      {/* Right side: form */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-2">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base">
                A
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-950">
                Adap<span className="text-indigo-600">Teach</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Buat Akun Baru</h1>
            <p className="text-sm text-slate-500">Daftar sekarang untuk memulai materi yang disesuaikan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 rounded-xl">
                {success}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                placeholder="Masukkan nama lengkap"
                className="text-sm rounded-xl py-5 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                className="text-sm rounded-xl py-5 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="text-sm rounded-xl py-5 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Daftar Sebagai</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20">
                  <SelectValue placeholder="Pilih peran Anda" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-md">
                  <SelectItem value="STUDENT" className="rounded-lg">Siswa</SelectItem>
                  <SelectItem value="TEACHER" className="rounded-lg">Guru</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full py-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md shadow-indigo-100 transition-all duration-200 mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar...
                </>
              ) : "Daftar"}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500 pt-1">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
