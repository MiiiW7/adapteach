"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function TambahMateri() {
  // ...
  const handleClearMateri = () => {
    setResult(null);
    setTopik("");
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tambahMateriResult');
      localStorage.removeItem('tambahMateriTopik');
    }
  };
  // Restore preview from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tambahMateriResult');
      const savedTopik = localStorage.getItem('tambahMateriTopik');
      if (saved) setResult(JSON.parse(saved));
      if (savedTopik) setTopik(savedTopik);
    }
  }, []);
  const { kode } = useParams();
  const router = useRouter();
  const [topik, setTopik] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [regenerating, setRegenerating] = useState({
    visual: false,
    auditori: false,
    kinestetik: false
  });

  // Set client-side state after mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('tambahMateriResult');
    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("http://localhost:5678/webhook-test/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topik }),
      });
      if (!res.ok) throw new Error("Gagal mengambil materi");
      const data = await res.json();
      console.log(data);
      setResult(data);
      localStorage.setItem('tambahMateriResult', JSON.stringify(data));
      localStorage.setItem('tambahMateriTopik', topik);
      toast.success('Berhasil!', {
        description: 'Materi berhasil diambil',
        duration: 3000,
      });
    } catch (err) {
      const errorMessage = err.message || "Gagal mengambil materi";
      setError(errorMessage);
      toast.error('Gagal', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (style) => {
    setRegenerating(prev => ({ ...prev, [style]: true }));
    try {
      const res = await fetch("http://localhost:5678/webhook-test/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topik: topik,
          regenerate: style
        }),
      });

      if (!res.ok) throw new Error("Gagal meregenerasi konten");

      const responseData = await res.json();
      console.log(responseData)

      // Handle array response (assuming first item is the one we want)
      const newContent = Array.isArray(responseData) ? responseData[0] : responseData;

      setResult(prev => ({
        ...prev,
        [style]: newContent[style] || prev[style],
        penjelasam: newContent.penjelasan || prev.penjelasam // Handle both spellings
      }));

      // Update localStorage
      const updatedResult = {
        ...result,
        [style]: newContent[style],
        penjelasam: newContent.penjelasan || result.penjelasam // Handle both spellings
      };
      localStorage.setItem('tambahMateriResult', JSON.stringify(updatedResult));

      // Show success toast
      toast.success(`Materi ${style} berhasil diregenerasi`, {
        description: 'Konten baru telah berhasil dibuat',
        duration: 3000,
      });

    } catch (err) {
      const errorMessage = err.message || "Terjadi kesalahan saat meregenerasi";
      setError(errorMessage);
      console.error("Regenerate error:", err);
      toast.error('Gagal meregenerasi', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setRegenerating(prev => ({ ...prev, [style]: false }));
    }
  };

  const handleSubmitMateri = async (style) => {
    setLoading(true);
    setError("");
    try {
      // Ensure content is always a string
      let content = "";
      if (style === 'visual') {
        // For visual content, we might have an image URL
        content = typeof result.visual === 'string' ? result.visual : JSON.stringify(result.visual);
      } else if (style === 'auditori') {
        // For auditori content, we might have a video URL
        content = typeof result.auditori === 'string' ? result.auditori : JSON.stringify(result.auditori);
      } else if (style === 'kinestetik') {
        // For kinestetik content, we expect text content
        content = typeof result.kinestetik === 'string' ? result.kinestetik : JSON.stringify(result.kinestetik);
      }

      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: topik,
          content: content,
          courseCode: kode,
          learningStyle: style,
          explanation: result.penjelasam || null
        }),
      });
      if (!res.ok) throw new Error("Gagal menambah materi");
      const response = await res.json();

      // Show success toast
      toast.success('Berhasil!', {
        description: `Materi ${style} berhasil ditambahkan ke kelas`,
        duration: 3000,
      });

      // Optionally, you can redirect or clear the form here
      // router.push(`/kelas/${kode}`);
    } catch (err) {
      const errorMessage = err.message || "Terjadi kesalahan";
      setError(errorMessage);
      console.error("Error details:", err);
      toast.error('Gagal menyimpan', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tambah Materi Baru</h1>
        <p className="text-gray-600">Buat materi pembelajaran dengan gaya visual, auditori, dan kinestetik</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:gap-4">
            <div className="flex-1">
              <Label htmlFor="topik" className="block text-sm font-semibold mb-2 text-gray-700">
                Topik Materi
              </Label>
              <Input
                id="topik"
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                required
                disabled={loading}
                placeholder="Masukkan topik materi..."
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {error && <div className="text-red-500 text-sm md:hidden">{error}</div>}
            <div className="mt-4 md:mt-0">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengambil...
                  </span>
                ) : "Ambil Materi"}
              </Button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm hidden md:block bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
        </form>
      </div>

      {isClient && result && result.visual && result.auditori && result.kinestetik && (
        <div className="space-y-8" key="result-content">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Hasil Materi</h2>
            <p className="text-gray-600">Pilih materi yang ingin Anda tambahkan ke kelas</p>
          </div>

          {/* Explanation Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Penjelasan Gaya Belajar</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Penjelasan Materi</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {result.penjelasam || "Penjelasan umum tentang materi yang akan dipelajari."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visual Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md border border-purple-200 overflow-hidden">
              <div className="bg-purple-600 text-white p-4">
                <h3 className="font-bold text-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Visual
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center" style={{ minHeight: '192px' }}>
                  {result.visual && result.visual.startsWith('http') ? (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <img
                        src={result.visual}
                        alt="Visual Materi"
                        className="max-w-full max-h-48 w-auto h-auto object-contain p-2"
                        style={{ maxWidth: '100%', maxHeight: '192px' }}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          console.error('Image failed to load:', result.visual);
                          // Try loading with proxy service
                          const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(result.visual.replace(/^https?:\/\//, ''))}`;
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
                          console.log('Image loaded successfully:', result.visual);
                        }}
                      />
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <div className="text-center">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-500">Gambar tidak tersedia</p>
                          <p className="text-xs text-gray-400 mt-2">URL: {result.visual}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">Materi visual berupa gambar dan infografis untuk memudahkan pemahaman.</p>
                {result.visual && result.visual.startsWith('http') && (
                  <div className="text-xs">
                    <a
                      href={result.visual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 underline flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Lihat sumber gambar
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Auditori Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200 overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h3 className="font-bold text-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  Auditori
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {result.auditori && result.auditori.includes('youtube.com') ? (
                    <div className="w-full h-48 bg-black flex items-center justify-center">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${result.auditori.split('v=')[1]}`}
                        title="Auditori Materi"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">Materi audio dan video untuk pembelajaran melalui pendengaran.</p>
                {result.auditori && result.auditori.includes('youtube.com') && (
                  <div className="text-xs">
                    <a
                      href={result.auditori}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Lihat video YouTube
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Kinestetik Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md border border-green-200 overflow-hidden">
              <div className="bg-green-600 text-white p-4">
                <h3 className="font-bold text-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Kinestetik
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{result.kinestetik}</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">Materi praktik dan aktivitas fisik untuk pembelajaran hands-on.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Tambahkan Materi ke Kelas</h3>
              <p className="text-sm text-gray-600">Pilih salah satu atau semua materi untuk ditambahkan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Button
                  onClick={() => handleSubmitMateri('visual')}
                  type="button"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md mb-2"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Materi Visual
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full ml-auto text-xs h-8 px-3 bg-white hover:bg-purple-50 text-purple-700 border-purple-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegenerate('visual');
                  }}
                  disabled={regenerating.visual}
                >
                  {regenerating.visual ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : 'Regenerate Materi Visual'}
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => handleSubmitMateri('auditori')}
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md mb-2"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Materi Auditori
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full ml-auto text-xs h-8 px-3 bg-white hover:bg-blue-50 text-blue-700 border-blue-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegenerate('auditori');
                  }}
                  disabled={regenerating.auditori}
                >
                  {regenerating.auditori ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : 'Regenerate Materi Auditori'}
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => handleSubmitMateri('kinestetik')}
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md mb-2"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Materi Kinestetik
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full ml-auto text-xs h-8 px-3 bg-white hover:bg-green-50 text-green-700 border-green-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegenerate('kinestetik');
                  }}
                  disabled={regenerating.kinestetik}
                >
                  {regenerating.kinestetik ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : 'Regenerate Materi Kinestetik'}
                </Button>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleClearMateri}
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-medium py-2 px-6 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Semua Materi
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
