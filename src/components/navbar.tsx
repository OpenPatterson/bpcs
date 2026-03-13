"use client";

import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Meetings", href: "/meetings" },
  { name: "Your Gov", href: "/your-gov" },
  { name: "Search", href: "/search" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-navy">
              BPCS
            </span>
            <span className="hidden text-sm text-muted sm:inline">
              Better Patterson Council Site
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-text hover:bg-surface hover:text-navy transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/login"
              className="ml-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden rounded-md p-2 text-muted hover:bg-surface hover:text-text"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="border-t pb-4 md:hidden">
            <div className="space-y-1 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-text hover:bg-surface hover:text-navy"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-base font-medium text-navy"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
