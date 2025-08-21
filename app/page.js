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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to <span className="text-blue-600">AdapTeach</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Platform pembelajaran pribadi Anda yang menyesuaikan dengan gaya dan kecepatan belajar Anda yang unik.
                Buka potensi Anda dengan sistem pendidikan inovatif kami yang didukung oleh kecerdasan buatan (AI).
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button className="px-8 py-3 text-lg">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="px-8 py-3 text-lg">Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Why Choose AdapTeach?
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-4 p-4 bg-gray-100 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Learning?
                </h2>
                <p className="mx-auto max-w-[600px] md:text-xl">
                  Join thousands of students and teachers who are already using AdapTeach to achieve their educational goals.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/register">
                  <Button className="w-full py-3 text-lg bg-white text-blue-600 hover:bg-gray-100">
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
