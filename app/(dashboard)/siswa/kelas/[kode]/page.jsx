"use client";
import { useEffect, useState } from "react";

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

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (kode) fetchData();
  }, [kode]);

  if (loading) return <div>Memuat...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!course || !user) return null;

  // Filter materi sesuai learningStyle user
  const materiSesuai = course.materials?.filter(m => {
    if (!user.learningStyle) return true;
    return m.learningStyle?.toLowerCase() === user.learningStyle.toLowerCase();
  }) || [];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Kelas: {course.title}</h1>
      <div className="mb-4 text-gray-600">Kode: {course.code}</div>
      <div className="mb-8 text-gray-700">{course.description}</div>
      <h2 className="text-2xl font-semibold mb-4">Materi untuk Gaya Belajar: <span className="font-bold">{user.learningStyle || "Semua"}</span></h2>
      {materiSesuai.length === 0 ? (
        <div>Tidak ada materi yang sesuai gaya belajar Anda.</div>
      ) : (
        <div className="space-y-6">
          {materiSesuai.map(m => (
            <Card key={m.id} className="p-6">
              <h3 className="text-xl font-bold mb-2">{m.title}</h3>
              <div className="mb-2 text-gray-500 text-sm">Gaya Belajar: {m.learningStyle}</div>
              {/* Render konten sesuai gaya belajar */}
              {user.learningStyle?.toLowerCase() === "auditory" && m.content.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i) ? (
                <div className="aspect-video w-full max-w-xl mx-auto my-4">
                  <iframe
                    src={convertYoutubeUrlToEmbed(m.content)}
                    title={m.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded"
                  ></iframe>
                </div>
              ) : user.learningStyle?.toLowerCase() === "visual" && m.content.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i ) ? (
                <img src={m.content} alt={m.title} className="max-w-full rounded shadow mb-2" />
              ) : (
                <div>{m.content}</div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
