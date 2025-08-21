// components/guest-navbar.jsx
import Link from "next/link";

export default function GuestNavbar() {
  return (
    <nav className="py-4 bg-white shadow-sm">
      <div className="container px-4 mx-auto max-w-7xl flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          {/* <img src="/globe.svg" className="h-8 w-auto" alt="logo" /> */}
          <span className="text-lg font-semibold tracking-tighter">AdapTech</span>
        </a>
        <div className="flex gap-2">
          <Link href="/login" className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition">Login</Link>
          <Link href="/register" className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 transition">Register</Link>
        </div>
      </div>
    </nav>
  );
}
