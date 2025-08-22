"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
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
  Clock9,
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
  // Support: https://youtu.be/xxx, https://www.youtube.com/watch?v=xxx
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="text-center">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse mx-auto"></div>
          </div>
          <p className="text-gray-500 mt-4 animate-bounce">
            Memuat detail kelas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                !
              </div>
              Terjadi Kesalahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!kelas) return null;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100/50 backdrop-blur-sm">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 to-blue-600/10 rounded-full transform -translate-x-24 translate-y-24"></div>

            <div className="relative p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                      {kelas.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5"
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        Kode: {kelas.code}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1.5"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {kelas.teacher?.name || "Anda"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl border border-gray-100">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {kelas.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                  <Calendar className="w-4 h-4" />
                  <span>Dibuat pada</span>
                  <FormattedDate date={kelas.createdAt} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
            <CardContent className="relative pt-8 pb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    Total Materi
                  </p>
                  <p className="text-3xl font-bold">
                    {kelas.materials?.length || 0}
                  </p>
                  <p className="text-blue-200 text-xs mt-1">
                    Konten pembelajaran
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
            <CardContent className="relative pt-8 pb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">
                    Jumlah Siswa
                  </p>
                  <p className="text-3xl font-bold">
                    {kelas.studentCount || 0}
                  </p>
                  <p className="text-purple-200 text-xs mt-1">
                    Siswa terdaftar
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
            <CardContent className="relative pt-8 pb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">
                    Instruktur
                  </p>
                  <p className="text-lg font-bold leading-tight">
                    {kelas.teacher?.name || "Anda"}
                  </p>
                  <p className="text-emerald-200 text-xs mt-1">
                    Pengajar kelas
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <User className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Section (untuk guru) */}
        {teacher && (
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-indigo-900">
                  <Users className="w-6 h-6" />
                  Daftar Siswa Terdaftar ({kelas.studentCount || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kelas.students && kelas.students.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {kelas.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-indigo-100 hover:shadow-md transition-shadow"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Belum Ada Siswa Terdaftar
                    </h3>
                    <p className="text-gray-500">
                      Bagikan kode kelas{" "}
                      <span className="font-semibold text-indigo-600">
                        {kelas.code}
                      </span>{" "}
                      kepada siswa untuk bergabung
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Materials Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Daftar Materi Pembelajaran
              </h2>
              <p className="text-gray-600">
                Koleksi materi yang disesuaikan dengan gaya belajar yang berbeda
              </p>
            </div>
            {teacher && (
              <Link href={`/kelas/${kelas.code}/tambah-materi`}>
                <Button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3">
                  <Activity className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
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
                    className="group relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg"
                  >
                    {/* Background gradient based on learning style */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        materi.learningStyle === "VISUAL"
                          ? "bg-gradient-to-br from-blue-500/5 to-indigo-500/10"
                          : materi.learningStyle === "AUDITORY"
                          ? "bg-gradient-to-br from-purple-500/5 to-pink-500/10"
                          : "bg-gradient-to-br from-emerald-500/5 to-green-500/10"
                      }`}
                    ></div>

                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-xl ${
                                materi.learningStyle === "VISUAL"
                                  ? "bg-blue-100 text-blue-600"
                                  : materi.learningStyle === "AUDITORY"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-emerald-100 text-emerald-600"
                              }`}
                            >
                              {materi.learningStyle === "VISUAL" ? (
                                <ImageIcon className="w-5 h-5" />
                              ) : materi.learningStyle === "AUDITORY" ? (
                                <PlayCircle className="w-5 h-5" />
                              ) : (
                                <Activity className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl font-bold text-gray-900 leading-tight group-hover:text-gray-800 transition-colors">
                                {materi.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Calendar className="w-4 h-4" />
                                <FormattedDate date={materi.createdAt} />
                              </div>
                            </div>
                          </div>

                          <CardDescription>
                            <Badge
                              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                                materi.learningStyle === "VISUAL"
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                                  : materi.learningStyle === "AUDITORY"
                                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                              }`}
                            >
                              Gaya Belajar {materi.learningStyle}
                            </Badge>
                          </CardDescription>
                          {/* Explanation Section */}
                          {materi.explanation && (
                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                                    Penjelasan Materi
                                  </h4>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {materi.explanation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      {/* Content preview based on learning style */}
                      {materi.learningStyle === "AUDITORY" &&
                      materi.content.match(
                        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i
                      ) ? (
                        <div className="space-y-4">
                          <div className="aspect-video w-full max-w-lg rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg">
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
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                          >
                            <PlayCircle className="w-4 h-4" />
                            Tonton di YouTube
                          </a>
                        </div>
                      ) : materi.learningStyle === "VISUAL" &&
                        materi.content.match(
                          /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i
                        ) ? (
                        <div className="space-y-4">
                          <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                            <ExternalImage
                              src={materi.content}
                              alt={materi.title}
                              maxHeight="20rem"
                              fallbackText="Gagal memuat gambar visual"
                              showRetry={true}
                              className="group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <a
                            href={materi.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Lihat Media Asli
                          </a>
                        </div>
                      ) : materi.learningStyle === "KINESTHETIC" ? (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                  <Activity className="h-5 w-5 text-white" />
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                                  Panduan Praktik
                                </h3>
                                <div className="text-emerald-700 max-h-48 overflow-y-auto">
                                  <p className="whitespace-pre-line leading-relaxed">
                                    {materi.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                  Konten Materi
                                </h3>
                                <p className="text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
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
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full transform -translate-x-12 translate-y-12"></div>

              <CardContent className="relative flex flex-col items-center justify-center py-16 px-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Belum Ada Materi Pembelajaran
                </h3>
                <p className="text-gray-600 text-center text-lg mb-6 max-w-md leading-relaxed">
                  Mulai berbagi pengetahuan dengan menambahkan materi
                  pembelajaran yang sesuai dengan gaya belajar siswa
                </p>

                {teacher ? (
                  <div className="flex flex-col items-center gap-4">
                    <Link href={`/kelas/${kelas.code}/tambah-materi`}>
                      <Button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg">
                        <Activity className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        Tambah Materi Pertama
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Atau upload konten visual, audio, atau kinestetik
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                      <Clock className="w-4 h-4 mr-2" />
                      Menunggu guru menambahkan materi
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Materi pembelajaran akan muncul di sini
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
