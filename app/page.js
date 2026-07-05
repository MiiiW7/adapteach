"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GuestNavbar from "@/components/guest-navbar";
import { Footer7 } from "@/components/footer7";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  Brain,
  Award,
  Eye,
  Volume2,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Check,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Simulator states
  const [activeStyle, setActiveStyle] = useState("VISUAL");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [kinestheticAnswer, setKinestheticAnswer] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'STUDENT') {
      router.replace('/siswa');
    } else if (role === 'TEACHER') {
      router.replace('/guru');
    }
  }, [router]);

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
      title: "Personalized Learning",
      description: "Materi belajar beradaptasi secara dinamis sesuai gaya belajar VAK (Visual, Auditori, Kinestetik) Anda."
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: "AI Adaptation Engine",
      description: "Kecerdasan buatan menyusun materi dan penjelasan dengan cepat untuk efisiensi belajar maksimal."
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      title: "Teacher Dashboard",
      description: "Guru dapat dengan mudah melacak progress, gaya belajar kelas, dan membuat materi kustom."
    },
    {
      icon: <Award className="h-6 w-6 text-indigo-600" />,
      title: "Progress Tracking",
      description: "Pantau pencapaian belajar melalui kuis adaptif dan analytics dashboard interaktif."
    }
  ];

  return (
    <>
      <main className="min-h-screen bg-slate-50 overflow-hidden">
        <GuestNavbar />

        {/* Hero Section */}
        <section className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-36 bg-gradient-to-b from-white to-slate-50">
          {/* Glowing blobs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]" />
          <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-blue-200/20 rounded-full blur-3xl -z-10" />

          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl md:text-6xl text-slate-900">
                    Belajar Lebih Cerdas Dengan <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">AI Adaptif</span>
                  </h1>
                  <p className="max-w-[540px] text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
                    Sistem pembelajaran yang memahami Anda. Mengubah materi belajar secara instan menjadi gaya
                    <strong className="text-indigo-600 font-semibold"> Visual</strong>,
                    <strong className="text-indigo-600 font-semibold"> Auditori</strong>, atau
                    <strong className="text-indigo-600 font-semibold"> Kinestetik</strong>.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link href="/register">
                    <Button className="w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200">
                      Mulai Belajar Sekarang <ArrowRight className="ml-2 h-4 w-4 text-white" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-2xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                      Login Guru & Siswa
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Interactive VAK Simulator Mockup */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-8 relative">

                  {/* Tabs header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-400" />
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">MODUL ADAPTIF PREVIEW</span>
                  </div>

                  <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl mb-6">
                    <button
                      onClick={() => setActiveStyle("VISUAL")}
                      className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeStyle === "VISUAL" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      <Eye className="h-4 w-4 text-indigo-600" /> Visual
                    </button>
                    <button
                      onClick={() => setActiveStyle("AUDITORY")}
                      className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeStyle === "AUDITORY" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      <Volume2 className="h-4 w-4 text-indigo-600" /> Auditori
                    </button>
                    <button
                      onClick={() => setActiveStyle("KINESTHETIC")}
                      className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeStyle === "KINESTHETIC" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      <Activity className="h-4 w-4 text-indigo-600" /> Kinestetik
                    </button>
                  </div>

                  {/* Simulator content viewport */}
                  <div className="min-h-[220px] flex flex-col justify-center bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                    {activeStyle === "VISUAL" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Topik: Fotosintesis</span>
                          <span className="text-xs text-slate-400">Mode Gambar/Infografis</span>
                        </div>
                        <div className="relative p-4 bg-white border border-slate-100 rounded-xl shadow-sm space-y-4">
                          {/* Visual diagram mock */}
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold rounded-lg flex flex-col items-center justify-center">
                              <span>☀️</span>
                              <span className="mt-1 font-bold">Cahaya</span>
                            </div>
                            <div className="p-2 bg-blue-50 border border-blue-100 text-blue-700 font-semibold rounded-lg flex flex-col items-center justify-center">
                              <span>💧</span>
                              <span className="mt-1 font-bold">Air (H2O)</span>
                            </div>
                            <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold rounded-lg flex flex-col items-center justify-center">
                              <span>🌱</span>
                              <span className="mt-1 font-bold">Kloroplas</span>
                            </div>
                          </div>
                          <div className="flex justify-center items-center py-1">
                            <div className="w-1.5 h-6 bg-indigo-300 rounded-full animate-bounce" />
                          </div>
                          <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold rounded-lg text-center">
                            Glukosa (Energi) + Oksigen (O2) dihasilkan!
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStyle === "AUDITORY" && (
                      <div className="space-y-4 text-center animate-fadeIn flex flex-col items-center">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Topik: Fotosintesis (Penjelasan Suara)</span>

                        <div className="w-full max-w-[280px] bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col items-center space-y-4">
                          {/* Waveform graphic */}
                          <div className="flex gap-1 items-end h-8">
                            {[4, 8, 12, 10, 5, 9, 14, 11, 7, 10, 15, 6, 8, 12, 4].map((h, i) => (
                              <div
                                key={i}
                                style={{ height: `${isPlayingAudio ? h * 2 : 4}px` }}
                                className={`w-1 rounded-full bg-indigo-600 transition-all duration-300`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-100 transition-all duration-200"
                          >
                            {isPlayingAudio ? <Pause className="h-5 w-5 fill-white text-white" /> : <Play className="h-5 w-5 fill-white text-white ml-0.5" />}
                          </button>

                          <div className="text-xs font-semibold text-slate-600">
                            {isPlayingAudio ? "Mendengarkan narasi AI..." : "Klik untuk putar audio penjelasan"}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStyle === "KINESTHETIC" && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Topik: Fotosintesis (Kuis Praktis)</span>
                          <button
                            onClick={() => { setKinestheticAnswer(null); setIsCardFlipped(false); }}
                            className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
                          >
                            <RotateCcw className="h-3 w-3 text-indigo-600" /> Reset
                          </button>
                        </div>

                        {!isCardFlipped ? (
                          <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm text-center space-y-4">
                            <p className="text-sm font-bold text-slate-800">
                              Manakah molekul yang diserap akar tumbuhan dari dalam tanah untuk bahan fotosintesis?
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <button
                                onClick={() => setKinestheticAnswer("wrong")}
                                className={`p-2.5 rounded-lg border font-semibold transition-all ${kinestheticAnswer === "wrong" ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"}`}
                              >
                                Karbondioksida (CO2)
                              </button>
                              <button
                                onClick={() => {
                                  setKinestheticAnswer("correct");
                                  setTimeout(() => setIsCardFlipped(true), 600);
                                }}
                                className={`p-2.5 rounded-lg border font-semibold transition-all ${kinestheticAnswer === "correct" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"}`}
                              >
                                Air (H2O)
                              </button>
                            </div>
                            {kinestheticAnswer === "correct" && (
                              <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                                <Check className="h-4.5 w-4.5 text-indigo-600" /> Benar! Membuka kartu penjelasan...
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-center space-y-3 cursor-pointer" onClick={() => setIsCardFlipped(false)}>
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto text-xs font-bold">
                              💡
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              <strong>Air (H2O)</strong> diserap oleh akar dan diangkut menuju daun sebagai reaktan utama untuk dikonversi menjadi energi glukosa.
                            </p>
                            <p className="text-[10px] text-indigo-500 font-semibold uppercase">Klik untuk kembali ke soal</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-white relative border-t border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Fitur Unggulan AdapTeach
              </h2>
              <p className="text-slate-500 text-base sm:text-lg">
                Platform pembelajaran adaptif kami didesain khusus untuk mendukung efektivitas belajar mengajar.
              </p>
            </div>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex flex-col p-6 bg-slate-50/50 border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="mb-6 p-3 bg-indigo-50 rounded-xl w-fit group-hover:bg-indigo-100 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Bagaimana AdapTeach Bekerja?
              </h2>
              <p className="text-slate-500 text-base sm:text-lg">
                Hanya dalam tiga langkah sederhana untuk personalisasi pengalaman pendidikan Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4 border border-indigo-100">
                  1
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">Diagnosis Gaya Belajar</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Siswa mengikuti tes preferensi untuk menentukan gaya belajar dominan mereka: Visual, Auditori, atau Kinestetik.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4 border border-indigo-100">
                  2
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">Adaptasi AI Otomatis</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Guru mengunggah materi pelajaran standar, dan AI kami langsung menyusun versi visual, rekaman suara, atau kuis interaktif.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4 border border-indigo-100">
                  3
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">Belajar & Evaluasi</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Siswa belajar dengan materi ternyaman dan paling efektif bagi mereka, disusul kuis adaptif untuk mengukur pemahaman.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,indigo-800_20%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,blue-900_30%,transparent_60%)]" />

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center max-w-3xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                  Siap Transformasi Cara Belajar Anda?
                </h2>
                <p className="text-indigo-100 text-base sm:text-lg md:text-xl max-w-2xl">
                  Bergabunglah dengan ribuan siswa dan pengajar yang sudah menggunakan AdapTeach untuk mencapai tujuan edukasi mereka.
                </p>
              </div>
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button className="w-full px-8 py-6 text-base font-semibold rounded-2xl bg-white text-indigo-950 hover:bg-indigo-200 shadow-xl transition-all duration-200">
                    Daftar Akun Gratis
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full px-8 py-6 text-base font-semibold rounded-2xl border-white/20 hover:bg-indigo-200 text-black transition-all duration-200">
                    Masuk ke Platform
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer7 />
      </main>
    </>
  );
}

