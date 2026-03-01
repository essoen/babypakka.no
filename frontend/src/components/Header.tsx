'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-baby-blue">
              Baby<span className="text-baby-pink">pakka</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/pakker"
              className="text-sm font-medium text-baby-text hover:text-baby-blue transition-colors"
            >
              Pakker
            </Link>
            <Link
              href="/produkter"
              className="text-sm font-medium text-baby-text hover:text-baby-blue transition-colors"
            >
              Produkter
            </Link>
            {!isLoading && (
              user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-baby-text hover:text-baby-blue transition-colors"
                  >
                    Min side
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-baby-text hover:text-baby-blue transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-baby-text-light">{user.name}</span>
                    <button
                      onClick={logout}
                      className="rounded-full border border-baby-blue px-4 py-1.5 text-sm font-medium text-baby-blue transition-colors hover:bg-baby-blue hover:text-white"
                    >
                      Logg ut
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/logg-inn"
                  className="rounded-full bg-baby-blue px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-baby-blue-dark"
                >
                  Logg inn
                </Link>
              )
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-baby-text md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Åpne meny"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="border-t border-baby-warm pb-4 pt-2 md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                href="/pakker"
                className="rounded-lg px-3 py-2 text-sm font-medium text-baby-text hover:bg-baby-warm"
                onClick={() => setMenuOpen(false)}
              >
                Pakker
              </Link>
              <Link
                href="/produkter"
                className="rounded-lg px-3 py-2 text-sm font-medium text-baby-text hover:bg-baby-warm"
                onClick={() => setMenuOpen(false)}
              >
                Produkter
              </Link>
              {!isLoading && (
                user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="rounded-lg px-3 py-2 text-sm font-medium text-baby-text hover:bg-baby-warm"
                      onClick={() => setMenuOpen(false)}
                    >
                      Min side
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-baby-text hover:bg-baby-warm"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <div className="mt-2 flex items-center justify-between px-3">
                      <span className="text-sm text-baby-text-light">{user.name}</span>
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="rounded-full border border-baby-blue px-4 py-1.5 text-sm font-medium text-baby-blue"
                      >
                        Logg ut
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/logg-inn"
                    className="mt-2 rounded-full bg-baby-blue px-5 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-baby-blue-dark"
                    onClick={() => setMenuOpen(false)}
                  >
                    Logg inn
                  </Link>
                )
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
