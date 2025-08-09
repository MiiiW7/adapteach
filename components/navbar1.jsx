"use client";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/globe.svg",
    alt: "logo",
    title: "AdapTeach",
  },
  onToggleSidebar = () => { }, // Tambahkan prop handler


  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/register" },
  }
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <section className="py-4 bg-white shadow-sm ">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Desktop Menu */}
        <nav className="hidden w-full justify-between md:flex">
          <div className="flex items-center gap-2">
            {/* Tombol Collapse Sidebar hanya jika login */}
            {isLoggedIn && (
              <SidebarTrigger

                className="mr-2 md:flex hidden"
                aria-label="Toggle Sidebar"
              >
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SidebarTrigger>
            )}
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              {/* <img src={logo.src} className="h-8 w-auto" alt={logo.alt} /> */}
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
          </div>
          <div className="flex gap-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Menu className="h-6 w-6 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.location.href = '/login';
                  }}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
                <Button asChild size="sm">
                  <a href={auth.signup.url}>{auth.signup.title}</a>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block md:hidden">
          <div className="flex items-center">
            {/* SidebarTrigger (Hamburger) */}
            {isLoggedIn && (
              <SidebarTrigger
                className="mr-2 flex md:hidden"
                aria-label="Toggle Sidebar"
              >
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SidebarTrigger>
            )}
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              {/* <img src={logo.src} className="h-8 w-auto" alt={logo.alt} /> */}
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex-1" />
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Menu className="h-6 w-6 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.location.href = '/login';
                  }}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px]">
                  <SheetHeader>
                    <SheetTitle>{logo.title}</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">

                    <div className="flex flex-col gap-3">
                      <Button asChild variant="outline">
                        <a href={auth.login.url}>{auth.login.title}</a>
                      </Button>
                      <Button asChild>
                        <a href={auth.signup.url}>{auth.signup.title}</a>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};


export { Navbar1 };
