"use client";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {Navbar1} from "@/components/navbar1";
import { Footer7 } from "@/components/footer7";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

  return (
    <>
      <main>
        <Navbar1 />
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-7xl font-bold">Welcome to AdapTeach</h1>
        <p className="mt-4 text-lg">Your personalized learning platform</p>
        <p className="mt-4 text-lg">Daftar sekarang!</p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant={"outline"}>Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
        <p className="mt@-4 text-sm text-gray-500">
          © 2025 AdapTeach. All rights reserved.
        </p>
        </div>
        <Footer7 />
      </main>
    </>
  );
}
