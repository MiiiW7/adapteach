"use client";
'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle, ImageIcon, FileText, Clock, User, Tag, Activity, Calendar, Clock9 } from "lucide-react";

// Client-side date formatter
function FormattedDate({ date }) {
  const [formatted, setFormatted] = useState({ date: '', time: '' });

  useEffect(() => {
    const formatDate = async () => {
      const { format } = await import('date-fns');
      const { id } = await import('date-fns/locale');
      setFormatted({
        date: format(new Date(date), 'd MMMM yyyy', { locale: id }),
        time: format(new Date(date), 'HH:mm', { locale: id })
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

export default function SiswaKelasPage() {
  const params = useParams();
  const kode = params?.kode;
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        // get user
        const resUser = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUser.ok) throw new Error("Gagal mengambil data user");
        const userData = await resUser.json();
        setUser(userData);
        // get course & materials
        const resCourse = await fetch(`/api/courses/siswa/${kode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resCourse.ok) throw new Error("Gagal mengambil data kelas");
        const courseData = await resCourse.json();
        setCourse(courseData);
        console.log("Course Data:", courseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (kode) fetchData();
  }, [kode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
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
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">!</div>
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

  if (!course || !user) return null;

  // Filter materi sesuai learningStyle user
  const materiSesuai = course.materials?.filter(m => {
    if (!user.learningStyle) return true;
    return m.learningStyle?.toLowerCase() === user.learningStyle.toLowerCase();
  }) || [];

  const getLearningStyleIcon = (style) => {
    switch (style?.toLowerCase()) {
      case 'auditory':
        return <PlayCircle className="w-4 h-4" />;
      case 'visual':
        return <ImageIcon className="w-4 h-4" />;
      case 'reading':
        return <BookOpen className="w-4 h-4" />;
      case 'kinesthetic':
        return <Activity className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getLearningStyleColor = (style) => {
    switch (style?.toLowerCase()) {
      case 'auditory':
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case 'visual':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'reading':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'kinesthetic':
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{course.title}</h1>
                  <p className="text-white/90 text-lg leading-relaxed">{course.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-colors">
                      <Tag className="w-4 h-4 mr-1" />
                      {course.code}
                    </Badge>
                    {user.learningStyle && (
                      <Badge className={`${getLearningStyleColor(user.learningStyle)} backdrop-blur-sm border-white/30`}>
                        {getLearningStyleIcon(user.learningStyle)}
                        <span className="ml-1">{user.learningStyle}</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Learning Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Materi yang Dipersonalisasi untuk Anda
              </h2>
              <p className="text-sm text-gray-600 mt-1">Konten yang disesuaikan dengan gaya belajar Anda</p>
            </div>
          </div>

          {materiSesuai.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Materi</h3>
                <p className="text-gray-500 text-center max-w-sm">Belum ada materi yang sesuai dengan gaya belajar Anda saat ini.</p>
                <p className="text-sm text-gray-400 mt-2">Tim kami sedang menyiapkan konten yang lebih relevan untuk Anda.</p>
                <div className="mt-4 flex gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {materiSesuai.map((m) => (
                <Card key={m.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 hover:border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg font-semibold leading-tight text-gray-900">
                          {m.title.charAt(0).toUpperCase() + m.title.slice(1)}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <FormattedDate date={m.createdAt} />
                        </div>
                      </div>
                      <Badge className={`${getLearningStyleColor(m.learningStyle)} text-xs px-1.5 py-0.5`}>
                        {getLearningStyleIcon(m.learningStyle)}
                        <span className="ml-1">{m.learningStyle}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Content based on learning style */}
                    {user.learningStyle?.toLowerCase() === "auditory" && m.content.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i) ? (
                      <div className="space-y-4">
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                          <iframe
                            src={convertYoutubeUrlToEmbed(m.content)}
                            title={m.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          ></iframe>
                        </div>
                        <a
                          href={m.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Tonton di YouTube
                        </a>
                      </div>
                    ) : user.learningStyle?.toLowerCase() === "visual" && m.content.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? (
                      <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-xl flex justify-center items-center bg-gray-50">
                          <img
                            src={m.content}
                            alt="Visual Materi"
                            className="w-auto h-auto object-contain p-2"
                            style={{ maxWidth: '100%', maxHeight: '240px' }}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Try loading with proxy service
                              const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(m.content.replace(/^https?:\/\//, ''))}`;
                              console.log('Trying proxy:', proxyUrl);

                              // Create new image element to test proxy
                              const testImg = new Image();
                              testImg.onload = () => {
                                e.target.src = proxyUrl;
                                e.target.style.display = 'block';
                                e.target.nextElementSibling.style.display = 'none';
                              };
                              testImg.onerror = () => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              };
                              testImg.src = proxyUrl;
                            }}
                            onLoad={(e) => {
                              console.log('Image loaded successfully:', m.content);
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                        </div>
                        <a
                          href={m.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Lihat Gambar
                        </a>
                      </div>
                    ) : user.learningStyle?.toLowerCase() === "kinesthetic" ? (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-3 border-orange-400 p-3 rounded-lg">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <Activity className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4 flex-1">
                              <h3 className="text-sm font-semibold text-orange-800 mb-1">Panduan Praktik</h3>
                              <div className="text-xs text-orange-700 leading-relaxed">
                                <p className="whitespace-pre-line">{m.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-xs max-w-none">
                        <p className="text-gray-700 leading-relaxed text-sm">{m.content}</p>
                      </div>
                    )}
                    {m.explanation && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h4 className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                          <FileText className="w-3 h-3" />
                          Penjelasan Tambahan
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-md">
                          {m.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Total Materi</p>
                  <p className="text-3xl font-bold">{course.materials?.length || 0}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <BookOpen className="w-8 h-8" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-100">
                <span className="text-xs">Materi tersedia</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">Materi Sesuai</p>
                  <p className="text-3xl font-bold">{materiSesuai.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-purple-100">
                <span className="text-xs">Disesuaikan untuk Anda</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Gaya Belajar</p>
                  <p className="text-xl font-bold capitalize">{user.learningStyle || "Umum"}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                    {getLearningStyleIcon(user.learningStyle)}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-100">
                <span className="text-xs">Profil belajar Anda</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
