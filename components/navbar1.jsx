"use client";
import { LogOut, User as UserIcon, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

const Navbar1 = ({
  logo = {
    url: "/",
    title: "AdapTeach",
  },
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  }
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "User", email: "", role: "" });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);

    if (token) {
      try {
        // Decode JWT payload locally without external dependency
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
          const decoded = JSON.parse(payloadJson);
          setUserInfo({
            name: decoded.name || "User",
            email: decoded.email || "",
            role: decoded.role || role || "STUDENT"
          });
        }
      } catch (e) {
        console.error("Failed to decode token", e);
        setUserInfo(prev => ({ ...prev, role: role || "STUDENT" }));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  // Get initials for Avatar Fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="w-full border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      {/* Dynamic container width: full fluid for dashboard layout, container max-w-7xl for standard guest view */}
      <div className={`mx-auto flex h-16 items-center justify-between transition-all duration-200 ${
        isLoggedIn ? "w-full px-6" : "container px-4 max-w-7xl"
      }`}>
        
        {/* Left Side: Brand Logo and Sidebar Trigger */}
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <SidebarTrigger 
              className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-50 border border-slate-100 text-slate-600 transition-colors cursor-pointer"
              aria-label="Toggle Sidebar"
            />
          )}
          
          <Link href={logo.url} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-100 group-hover:scale-105 transition-all">
              A
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
              Adap<span className="text-indigo-600">Teach</span>
            </span>
          </Link>
        </div>

        {/* Right Side: Navigation Links & User Dropdown */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {userInfo.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium leading-none">
                      {userInfo.role === 'TEACHER' ? 'Guru' : userInfo.role === 'ADMIN' ? 'Admin' : 'Siswa'}
                    </span>
                  </div>
                  <Avatar className="h-9 w-9 ring-2 ring-indigo-50 border border-white hover:ring-indigo-100 transition-all shadow-sm">
                    <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold text-xs">
                      {getInitials(userInfo.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-1.5 shadow-xl border border-slate-100 bg-white">
                <div className="px-3 py-2.5 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{userInfo.name}</p>
                  <p className="text-xs text-slate-400 truncate">{userInfo.email}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                    <Shield className="h-2.5 w-2.5" />
                    {userInfo.role === 'TEACHER' ? 'Guru' : userInfo.role === 'ADMIN' ? 'Admin' : 'Siswa'}
                  </span>
                </div>
                
                <DropdownMenuItem asChild className="rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 cursor-pointer">
                  <Link href="/profile" className="flex items-center w-full px-2 py-2 text-xs font-medium">
                    <UserIcon className="mr-2 h-4 w-4 text-slate-500" /> Profil Saya
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700 cursor-pointer mt-1"
                >
                  <div className="flex items-center w-full px-2 py-2 text-xs font-semibold">
                    <LogOut className="mr-2 h-4 w-4 text-rose-500" /> Keluar
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link 
                href={auth.login.url} 
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
              >
                {auth.login.title}
              </Link>
              <Link 
                href={auth.signup.url} 
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200"
              >
                {auth.signup.title}
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export { Navbar1 };
