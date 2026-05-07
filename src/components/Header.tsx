// components/Header.tsx

"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-purple-900/40 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide text-white"
        >
          Slot
          <span className="text-purple-500">Master</span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 transition hover:text-purple-400"
          >
            Home
          </Link>

          <Link
            href="/bookings-information"
            className="text-sm font-medium text-gray-300 transition hover:text-purple-400"
          >
            Bookings
          </Link>

          <Link
            href="/admin"
            className="text-sm font-medium text-gray-300 transition hover:text-purple-400"
          >
            Admin
          </Link>
        </nav>

        {/* BUTTON */}
        <div className="hidden md:block">
          <button className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-900 px-5 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:from-purple-500 hover:to-purple-800">
            Get Started
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-purple-800/40 p-2 text-white md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-purple-900/30 bg-black/95 md:hidden">
          <div className="space-y-4 px-4 py-5">

            <Link
              href="/"
              className="block text-sm font-medium text-gray-300 hover:text-purple-400"
            >
              Home
            </Link>

            <Link
              href="/bookings"
              className="block text-sm font-medium text-gray-300 hover:text-purple-400"
            >
              Bookings
            </Link>

            <Link
              href="/admin"
              className="block text-sm font-medium text-gray-300 hover:text-purple-400"
            >
              Admin
            </Link>

            <button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-900 px-5 py-2 text-sm font-semibold text-white">
              Get Started
            </button>

          </div>
        </div>
      )}
    </header>
  );
}