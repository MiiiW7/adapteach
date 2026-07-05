"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  PlayCircle,
  ImageIcon,
  FileText,
  Clock,
  User,
  Users,
  Tag,
  Activity,
  Calendar,
  Copy,
  ChevronRight,
  Sparkles,
  Plus
} from "lucide-react";
import ExternalImage from "@/components/ExternalImage";

// Client-side date formatter
function FormattedDate({ date }) {
  const [formatted, setFormatted] = useState({ date: "", time: "" });

  useEffect(() => {
    const formatDate = async () => {
      const { format } = await import("date-fns");
      const { id } = await import("date-fns/locale");
      setFormatted({
        date: format(new Date(date), "d MMMM yyyy", { locale: id }),
        time: format(new Date(date), "HH:mm", { locale: id }),
      });
    };
    formatDate();
  }, [date]);

  return (
    <>
      <span>{formatted.date}</span>
      <span className="mx-1">•</span>
      <span>{formatted.time} WIB</span>
    </>
  );
}

// Helper: konversi url youtube ke embed
function convertYoutubeUrlToEmbed(url) {
  let id = null;
  if (url.includes("youtu.be/")) {
    id = url.split("youtu.be/")[1].split(/[?&]/)[0];
  } else if (url.includes("youtube.com/watch?v=")) {
    id = url.split("v=")[1].split("&")[0];
  }
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

export default function DetailKelas() {
  const params = useParams();
  const kode = params?.kode;
  const [kelas, setKelas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teacher, setTeacher] = useState(false);

  useEffect(() => {
    const fetchKelas = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/courses/${kode}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "TEACHER") {
      setTeacher(true);
    } else {
      setTeacher(false);
    }
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Kode kelas "${code}" disalin ke clipboard!`);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 space-y-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-2xl border border-red-100 shadow-xl shadow-red-50/50 bg-white">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <span className="text-red-500 text-xl font-bold">!</span>
            </div>
            <CardTitle className="text-red-600 font-bold">Terjadi Kesalahan</CardTitle>
            <CardDescription className="text-slate-500">{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Link href={teacher ? "/guru" : "/siswa"}>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-5">
                Kembali ke Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!kelas) return null;

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {/* Sleek Header Banner (Solid Color) */}
        <div className="relative overflow-hidden bg-indigo-950 rounded-3xl shadow-md text-white">
          <div className="relative p-8 md:p-12 flex flex-col justify-between h-full z-10 space-y-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

              {/* Title & Badge */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                  <BookOpen className="w-7 h-7 text-indigo-300" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none text-white">
                    {kelas.title}
                  </h1>
                </div>
              </div>

              {/* Class Action Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => handleCopyCode(kelas.code)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-white/20 active:scale-95 transition-all cursor-pointer shadow-sm"
                  title="Klik untuk menyalin kode"
                >
                  <Tag className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Kode: <strong>{kelas.code}</strong></span>
                  <Copy className="h-3.5 w-3.5 text-white/50" />
                </button>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 text-white border border-white/10 shadow-sm">
                  <User className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{kelas.teacher?.name || "Anda"}</span>
                </div>
              </div>
            </div>

            {/* Description Banner Box */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm space-y-4">
              <p className="text-indigo-100 leading-relaxed text-sm md:text-base font-medium">
                {kelas.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Calendar className="w-3.5 h-3.5" />
                <span>Dibuat pada</span>
                <FormattedDate date={kelas.createdAt} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden relative">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Materi</p>
                <p className="text-3xl font-extrabold text-slate-800">{kelas.materials?.length || 0}</p>
                <span className="text-[10px] text-slate-400 font-medium leading-none">Bahan ajar terbit</span>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden relative">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jumlah Siswa</p>
                <p className="text-3xl font-extrabold text-slate-800">{kelas.studentCount || 0}</p>
                <span className="text-[10px] text-slate-400 font-medium leading-none">Siswa terdaftar</span>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden relative">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instruktur</p>
                <p className="text-base font-extrabold text-slate-800 truncate max-w-[180px]">
                  {kelas.teacher?.name || "Anda"}
                </p>
                <span className="text-[10px] text-slate-400 font-medium leading-none">Pengajar Utama</span>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registered Students List Container */}
        {teacher && (
          <Card className="border border-slate-100 bg-white rounded-3xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-50 flex flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-slate-800 font-bold text-lg md:text-xl">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Siswa Terdaftar ({kelas.studentCount || 0})
                </CardTitle>
                <CardDescription className="text-xs">
                  Siswa yang terhubung ke kelas adaptif Anda
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {kelas.students && kelas.students.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kelas.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 p-3.5 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-md rounded-2xl transition-all"
                    >
                      <div className="w-9 h-9 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center justify-center text-xs">
                        {getInitials(student.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {student.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                    <Users className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    Belum Ada Siswa Terdaftar
                  </h3>
                  <p className="text-xs text-slate-500 max-w-[320px] leading-relaxed">
                    Bagikan kode kelas <strong className="text-indigo-600 font-bold">{kelas.code}</strong> agar siswa dapat mendaftar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Materials List Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Materi Pembelajaran
              </h2>
              <p className="text-xs text-slate-500">
                Bahan ajar adaptif yang disesuaikan dengan preferensi gaya belajar siswa
              </p>
            </div>
            {teacher && (
              <Link href={`/kelas/${kelas.code}/tambah-materi`}>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all font-semibold py-5.5 px-5 cursor-pointer">
                  <Plus className="w-4 h-4 mr-1.5 text-white" />
                  Tambah Materi Baru
                </Button>
              </Link>
            )}
          </div>

          {kelas.materials && kelas.materials.length > 0 ? (
            <div className="grid gap-6">
              {[...kelas.materials]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((materi) => (
                  <Card
                    key={materi.id}
                    className={`relative overflow-hidden bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all rounded-3xl ${materi.learningStyle === "VISUAL"
                      ? "border-l-4 border-l-blue-500"
                      : materi.learningStyle === "AUDITORY"
                        ? "border-l-4 border-l-purple-500"
                        : "border-l-4 border-l-emerald-500"
                      }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl ${materi.learningStyle === "VISUAL"
                          ? "bg-blue-50 text-blue-600"
                          : materi.learningStyle === "AUDITORY"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-emerald-50 text-emerald-600"
                          }`}>
                          {materi.learningStyle === "VISUAL" ? (
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                          ) : materi.learningStyle === "AUDITORY" ? (
                            <PlayCircle className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Activity className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-lg font-bold text-slate-800 leading-tight">
                              {materi.title}
                            </CardTitle>
                            <Badge className={`text-[10px] font-bold rounded-lg px-2.5 py-0.5 border ${materi.learningStyle === "VISUAL"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : materi.learningStyle === "AUDITORY"
                                ? "bg-purple-50 text-purple-700 border-purple-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                              }`}>
                              Gaya Belajar: {materi.learningStyle}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                            <Clock className="w-3 h-3 text-slate-300" />
                            <FormattedDate date={materi.createdAt} />
                          </div>
                        </div>
                      </div>

                      {/* Explanation box */}
                      {materi.explanation && (
                        <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-2.5">
                          <FileText className="w-4.5 h-4.5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-800">
                              Ringkasan & Penjelasan
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {materi.explanation}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0 pb-6 px-6">
                      {/* Adapting rendering container depending on style */}
                      {materi.learningStyle === "AUDITORY" &&
                        materi.content.match(
                          /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i
                        ) ? (
                        <div className="space-y-3">
                          <div className="aspect-video w-full max-w-xl rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                            <iframe
                              src={convertYoutubeUrlToEmbed(materi.content)}
                              title={materi.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                          <a
                            href={materi.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-purple-600" />
                            Buka Tautan YouTube
                          </a>
                        </div>
                      ) : materi.learningStyle === "VISUAL" &&
                        materi.content.match(
                          /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i
                        ) ? (
                        <div className="space-y-3">
                          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 p-2 max-w-xl">
                            <ExternalImage
                              src={materi.content}
                              alt={materi.title}
                              maxHeight="20rem"
                              fallbackText="Gagal memuat visual media"
                              showRetry={true}
                              className="hover:scale-[1.02] transition-transform duration-300 w-full object-cover"
                            />
                          </div>
                          <a
                            href={materi.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                            Buka Gambar Asli
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className={`p-5 rounded-2xl border shadow-sm ${materi.learningStyle === "KINESTHETIC"
                            ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                            : "bg-slate-50 border-slate-100 text-slate-800"
                            }`}>
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${materi.learningStyle === "KINESTHETIC"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-600"
                                }`}>
                                {materi.learningStyle === "KINESTHETIC" ? (
                                  <Activity className="h-4.5 w-4.5 text-emerald-600" />
                                ) : (
                                  <FileText className="h-4.5 w-4.5 text-slate-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="text-sm font-bold">
                                  {materi.learningStyle === "KINESTHETIC" ? "Panduan Aktivitas Praktis" : "Teks Lengkap"}
                                </h4>
                                <p className="text-xs leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto pr-2 text-slate-600">
                                  {materi.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="border border-dashed border-slate-200 bg-slate-50/50 rounded-3xl">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-lg font-bold text-slate-800">
                    Belum Ada Materi Pembelajaran
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bagikan ilmu dengan mengunggah materi ajar adaptif (visual, suara, atau panduan praktik) pertama Anda.
                  </p>
                </div>
                {teacher && (
                  <Link href={`/kelas/${kelas.code}/tambah-materi`}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 transition-all font-semibold py-5.5 px-6 cursor-pointer">
                      Tambah Materi Pertama
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}

