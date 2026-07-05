"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login gagal');
      
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user && data.user.role) localStorage.setItem('role', data.user.role);
      
      if (data.user && data.user.role === 'STUDENT') {
        router.push('/siswa');
      } else if (data.user && data.user.role === 'TEACHER') {
        router.push('/guru');
      } else {
        router.push('/');
      }
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
            Belajar Lebih Cerdas Dengan AI Adaptif.
          </h2>
          <p className="text-slate-400 text-lg">
            AdaptEach menyesuaikan materi pembelajaran dengan gaya belajar unik setiap siswa secara otomatis.
          </p>
        </div>

        <div className="text-xs text-slate-500 z-10">
          © {new Date().getFullYear()} AdaptEach. All rights reserved.
        </div>
      </div>

      {/* Right side: form */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl">
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
            <h1 className="text-2xl font-bold text-slate-900">Masuk ke Akun</h1>
            <p className="text-sm text-slate-500">Masukkan email dan password untuk mengakses kelas Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl">
                {error}
              </div>
            )}
            
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

            <Button type="submit" className="w-full py-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md shadow-indigo-100 transition-all duration-200" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : "Masuk"}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500 pt-2">
            Belum punya akun?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
