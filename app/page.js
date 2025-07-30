import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-7xl font-bold">Welcome to AdapTeach</h1>
        <p className="mt-4 text-lg">Your personalized learning platform</p>
        <p className="mt-4 text-lg">Daftar sekarang!</p>
        <div className="flex gap-4">
          <Button>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline">
            <Link href="/register">Register</Link>
          </Button>
        </div>
        <p className="mt@-4 text-sm text-gray-500">
          © 2025 AdapTeach. All rights reserved.
        </p>
      </main>
    </>
  );
}
