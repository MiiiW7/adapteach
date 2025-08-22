"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GuestNavbar from "@/components/guest-navbar";
import { Footer7 } from "@/components/footer7";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, Brain, Award } from "lucide-react";

export default function Home() {
  const router = useRouter();
  
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
      icon: <BookOpen className="h-10 w-10 text-blue-500" />,
      title: "Personalized Learning",
      description: "Adaptive courses that adjust to your learning pace and style"
    },
    {
      icon: <Users className="h-10 w-10 text-green-500" />,
      title: "Expert Instructors",
      description: "Learn from qualified teachers with real-world experience"
    },
    {
      icon: <Brain className="h-10 w-10 text-purple-500" />,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations to improve your learning"
    },
    {
      icon: <Award className="h-10 w-10 text-yellow-500" />,
      title: "Certification",
      description: "Earn certificates to showcase your achievements"
    }
  ];

  return (
    <>
      <main>
        <GuestNavbar />
        
        {/* Hero Section */}
        <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-6 sm:px-8 md:px-6">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-2xl font-bold tracking-tight leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/none">
                  Welcome to <span className="text-blue-600">AdapTeach</span>
                </h1>
                <p className="mx-auto max-w-[90%] sm:max-w-[80%] md:max-w-[700px] text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg lg:text-xl dark:text-gray-400">
                Platform pembelajaran pribadi Anda yang menyesuaikan dengan gaya dan kecepatan belajar Anda yang unik.
                Buka potensi Anda dengan sistem pendidikan inovatif kami yang didukung oleh kecerdasan buatan (AI).
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link href="/register">
                  <Button className="px-8 py-3 text-lg font-semibold">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="px-8 py-3 text-lg font-semibold">Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-6 sm:px-8 md:px-6">
            <h2 className="text-2xl font-bold tracking-tight leading-tight sm:text-3xl md:text-4xl lg:text-5xl text-center mb-8 sm:mb-12 md:mb-16">
              Why Choose AdapTeach?
            </h2>
            <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
          <div className="container px-6 sm:px-8 md:px-6">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl font-bold tracking-tight leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
                  Ready to Transform Your Learning?
                </h2>
                <p className="mx-auto max-w-[90%] sm:max-w-[80%] md:max-w-[600px] text-sm leading-relaxed sm:text-base md:text-lg lg:text-xl text-blue-100">
                  Join thousands of students and teachers who are already using AdapTeach to achieve their educational goals.
                </p>
              </div>
              <div className="w-full max-w-xs sm:max-w-sm space-y-3">
                <Link href="/register">
                  <Button className="w-full py-3 sm:py-4 text-base sm:text-lg font-medium bg-white text-blue-600 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 rounded-lg">
                    Create Free Account
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
