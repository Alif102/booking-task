// components/Footer.tsx

import {  Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-purple-900/30 bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold text-white">
            Slot
            <span className="text-purple-500">Master</span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-400">
            Modern booking platform built with Next.js, Prisma,
            PostgreSQL, and Tailwind CSS.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <div className="space-y-3 text-sm">
            <a
              href="/"
              className="block text-gray-400 transition hover:text-purple-400"
            >
              Home
            </a>

            <a
              href="/bookings"
              className="block text-gray-400 transition hover:text-purple-400"
            >
              Bookings
            </a>

            <a
              href="/admin"
              className="block text-gray-400 transition hover:text-purple-400"
            >
              Admin Panel
            </a>
          </div>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Connect
          </h3>

          <div className="flex items-center gap-4">

            

            <button className="rounded-xl border border-purple-800/40 p-3 text-gray-300 transition hover:border-purple-500 hover:text-purple-400">
              <Mail size={18} />
            </button>

          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-purple-900/20 py-5 text-center text-sm text-gray-500">
        © 2026 Booking Service. All rights reserved.
      </div>
    </footer>
  );
}