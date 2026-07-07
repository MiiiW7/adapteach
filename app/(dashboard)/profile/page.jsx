"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Mail, Shield, BrainCircuit, Key, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    learningStyle: ""
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    learningStyle: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal memuat profil");

        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          learningStyle: data.learningStyle || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } catch (err) {
        toast.error("Gagal memuat data profil", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, learningStyle: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Konfirmasi password baru tidak cocok");
        setSaving(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("Password baru minimal 6 karakter");
        setSaving(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const body = {
        name: formData.name,
        email: formData.email
      };

      if (user.role === "STUDENT" && formData.learningStyle) {
        body.learningStyle = formData.learningStyle;
      }

      if (formData.newPassword) {
        body.password = formData.newPassword;
      }

      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui profil");

      toast.success("Profil berhasil diperbarui!");
      
      setUser(data.user);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      // Update local storage name / role if needed
      if (data.user.name) {
        // Trigger sidebar user display refresh if applicable
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyimpan", { description: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profil Saya</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola informasi pribadi, gaya belajar, dan pengaturan keamanan Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar Card */}
        <div className="space-y-6">
          <Card className="border border-slate-100 shadow-lg overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardContent className="relative pt-12 text-center pb-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-800 text-3xl font-bold shadow-md">
                  {user.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "U"}
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">{user.email}</p>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  <Shield className="w-3.5 h-3.5" />
                  {user.role === "TEACHER" ? "Guru" : user.role === "ADMIN" ? "Admin" : "Siswa"}
                </span>
                
                {user.role === "STUDENT" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-150">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    {user.learningStyle || "Belum Memilih"}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Account Forms */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <Card className="border border-slate-150 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <User className="w-4 h-4 text-indigo-600" />
                  Detail Pribadi
                </CardTitle>
                <CardDescription>Perbarui nama lengkap dan alamat email Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="nama@email.com"
                      className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                </div>

                {user.role === "STUDENT" && (
                  <div className="space-y-1.5 pt-2">
                    <Label htmlFor="learningStyle">Gaya Belajar</Label>
                    <Select
                      value={formData.learningStyle}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="w-full rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20">
                        <SelectValue placeholder="Pilih gaya belajar Anda" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-md">
                        <SelectItem value="VISUAL">VISUAL (Gambar / Grafik)</SelectItem>
                        <SelectItem value="AUDITORY">AUDITORY (Audio / Video)</SelectItem>
                        <SelectItem value="KINESTHETIC">KINESTHETIC (Praktik / Kegiatan)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="border border-slate-150 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <Key className="w-4 h-4 text-indigo-600" />
                  Ganti Password
                </CardTitle>
                <CardDescription>Isi kolom di bawah jika Anda ingin mengganti password akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Minimal 6 karakter"
                      className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ketik ulang password baru"
                      className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-6 py-5 flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
