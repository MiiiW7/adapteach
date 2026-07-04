// components/guest-navbar.jsx
import Link from "next/link";

export default function GuestNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/85 backdrop-blur-md transition-all duration-200">
      <div className="container px-4 mx-auto max-w-7xl flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-100 group-hover:scale-105 transition-all">
            A
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
            Adap<span className="text-indigo-600">Teach</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors border-2 border-gray-600 rounded-lg"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

