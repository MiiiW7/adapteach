"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
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
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/courses/${kode}`, {
          headers: { 'Authorization': `Bearer ${token}` }
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
    const role = localStorage.getItem('role');
    if (role === 'TEACHER') {
      setTeacher(true);
    } else {
      setTeacher(false);
    }
  }, []);

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
  
  if (!kelas) return null;

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
                <h1 className="text-3xl font-bold text-gray-900">{kelas.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Tag className="w-3 h-3 mr-1" />
                    {kelas.code}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    <Activity className="w-3 h-3 mr-1" />
                    Aktif
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{kelas.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <Calendar className="w-4 h-4" />
              <FormattedDate date={kelas.createdAt} />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Materi</p>
                  <p className="text-2xl font-bold text-blue-900">{kelas.materials?.length || 0}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Jenis Gaya Belajar</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {new Set(kelas.materials?.map(m => m.learningStyle)).size || 0}
                  </p>
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
                  <p className="text-sm font-medium text-green-600">Guru</p>
                  <p className="text-lg font-bold text-green-900">{kelas.teacher?.name || 'Anda'}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Materials Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Daftar Materi</h2>
            {teacher && (
              <Link href={`/kelas/${kelas.code}/tambah-materi`}>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <Activity className="w-4 h-4 mr-2" />
                  Tambah Materi
                </Button>
              </Link>
            )}
          </div>

          {kelas.materials && kelas.materials.length > 0 ? (
            <div className="grid gap-6">
              {[...kelas.materials]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((materi) => (
                <Card key={materi.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div>
                          <CardTitle className="text-lg leading-tight">{materi.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <FormattedDate date={materi.createdAt} />
                          </div>
                        </div>
                        <CardDescription>
                          <Badge className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            materi.learningStyle === 'VISUAL' 
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                              : materi.learningStyle === 'AUDITORY' 
                                ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}>
                            {materi.learningStyle === 'VISUAL' ? <ImageIcon className="w-4 h-4 mr-1" /> : 
                             materi.learningStyle === 'AUDITORY' ? <PlayCircle className="w-4 h-4 mr-1" /> : 
                             <Activity className="w-4 h-4 mr-1" />}
                            {materi.learningStyle}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Content preview based on learning style */}
                    {materi.learningStyle === 'AUDITORY' && materi.content.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i) ? (
                      <div className="space-y-3">
                        <div className="aspect-video w-full max-w-2xl rounded-lg overflow-hidden bg-gray-100">
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
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Buka di YouTube
                        </a>
                      </div>
                    ) : materi.learningStyle === 'VISUAL' && materi.content.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? (
                      <div className="space-y-3">
                        <div className="relative overflow-hidden rounded-lg max-w-md">
                          <img 
                            src={materi.content} 
                            alt={materi.title} 
                            className="w-full h-auto max-h-64 object-contain rounded-lg group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <a 
                          href={materi.content} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Lihat Media
                        </a>
                      </div>
                    ) : materi.learningStyle === 'KINESTHETIC' ? (
                      <div className="space-y-4">
                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r max-w-2xl">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Activity className="h-5 w-5 text-orange-600" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-orange-800">Panduan Praktik</h3>
                              <div className="mt-2 text-sm text-orange-700 max-h-48 overflow-y-auto">
                                <p className="whitespace-pre-line">{materi.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-4 max-w-2xl">
                          <p className="text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">{materi.content}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada materi</h3>
                <p className="text-gray-500 text-center">Materi akan muncul di sini ketika Anda menambahkannya</p>
                {teacher && (
                  <Link href={`/kelas/${kelas.code}/tambah-materi`} className="mt-4">
                    <Button variant="outline" className="border-dashed">
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
