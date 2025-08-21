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
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 ">{course.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Tag className="w-3 h-3 mr-1" />
                    {course.code}
                  </Badge>
                  {user.learningStyle && (
                    <Badge className={getLearningStyleColor(user.learningStyle)}>
                      {getLearningStyleIcon(user.learningStyle)}
                      <span className="ml-1">{user.learningStyle}</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Personalized Learning Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Materi yang Dipersonalisasi untuk Anda
            </h2>
          </div>
          
          {materiSesuai.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-center">Belum ada materi yang sesuai dengan gaya belajar Anda.</p>
                <p className="text-sm text-gray-400 mt-2">Tim kami sedang menyiapkan konten yang lebih relevan.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1">
              {materiSesuai.map((m) => (
                <Card key={m.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div>
                          <CardTitle className="text-lg leading-tight">{m.title.charAt(0).toUpperCase() + m.title.slice(1)}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <FormattedDate date={m.createdAt} />
                          </div>
                        </div>
                        <CardDescription className="pt-2">
                          <Badge className={getLearningStyleColor(m.learningStyle)}>
                            {getLearningStyleIcon(m.learningStyle)}
                            <span className="ml-1">{m.learningStyle}</span>
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Content based on learning style */}
                    {user.learningStyle?.toLowerCase() === "auditory" && m.content.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i) ? (
                      <div className="space-y-3">
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                          <iframe
                            src={convertYoutubeUrlToEmbed(m.content)}
                            title={m.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                        <a 
                          href={m.content} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Buka di YouTube
                        </a>
                        {/* {m.explanation && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-purple-800 mb-2">Penjelasan</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {m.explanation}
                            </p>
                          </div>
                        )} */}
                      </div>
                    ) : user.learningStyle?.toLowerCase() === "visual" && m.content.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? (
                      <div className="space-y-3">
                        <div className="relative overflow-hidden rounded-lg">
                          <img 
                            src={m.content} 
                            alt={m.title} 
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <a 
                          href={m.content} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Lihat Media
                        </a>
                      </div>
                    ) : user.learningStyle?.toLowerCase() === "kinesthetic" ? (
                      <div className="space-y-4">
                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Activity className="h-5 w-5 text-orange-600" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-orange-800">Panduan Praktik</h3>
                              <div className="mt-2 text-sm text-orange-700">
                                <p className="whitespace-pre-line">{m.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {m.explanation && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Penjelasan</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Materi</p>
                  <p className="text-2xl font-bold text-blue-900">{course.materials?.length || 0}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Materi Sesuai</p>
                  <p className="text-2xl font-bold text-purple-900">{materiSesuai.length}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Gaya Belajar</p>
                  <p className="text-lg font-bold text-green-900 capitalize">{user.learningStyle || "Umum"}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                  {getLearningStyleIcon(user.learningStyle)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
