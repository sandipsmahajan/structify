"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DiamondButton } from "@/components/ui/diamond-button";

const navLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/visualize", label: "Visualize" },
  { href: "/practice", label: "Practice" },
  { href: "/interview", label: "Interview" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  const isLoading = status === "loading";
  const isSignedIn = status === "authenticated" && !!session?.user;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ease-crystal ${
        scrolled
          ? "glass border-b border-bd-border/60"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="heading-display text-xl tracking-tight text-bd-text-primary"
        >
          <span className="text-bd-cyan">Struct</span>
          <span className="text-bd-violet">ify</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-bd-text-secondary hover:text-bd-text-primary transition-colors duration-150 ease-crystal rounded"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-bd-raised animate-pulse" />
          ) : isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <DiamondButton variant="ghost" size="sm">
                  Dashboard
                </DiamondButton>
              </Link>
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "Avatar"}
                  className="w-8 h-8 rounded-full border border-bd-border"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-bd-cyan-dim flex items-center justify-center text-bd-cyan text-sm font-bold border border-bd-border">
                  {(session.user?.name ?? "U")[0].toUpperCase()}
                </div>
              )}
              <Link href="/api/auth/signout">
                <DiamondButton variant="ghost" size="sm">
                  Sign Out
                </DiamondButton>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <DiamondButton variant="ghost" size="sm">
                  Sign In
                </DiamondButton>
              </Link>
              <Link href="/auth/signin">
                <DiamondButton variant="primary" size="sm">
                  Start Free
                </DiamondButton>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-bd-text-secondary hover:text-bd-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={closeMenu} />
          <div ref={menuRef} className="md:hidden glass border-t border-bd-border/60 px-6 py-4 space-y-2 relative z-50 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block py-2.5 text-sm font-medium text-bd-text-secondary hover:text-bd-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-3 border-t border-bd-border/40">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard" onClick={closeMenu} className="flex-1">
                    <DiamondButton variant="ghost" size="sm" className="w-full justify-center">
                      Dashboard
                    </DiamondButton>
                  </Link>
                  <Link href="/api/auth/signout" className="flex-1">
                    <DiamondButton variant="ghost" size="sm" className="w-full justify-center">
                      Sign Out
                    </DiamondButton>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={closeMenu} className="flex-1">
                    <DiamondButton variant="ghost" size="sm" className="w-full justify-center">
                      Sign In
                    </DiamondButton>
                  </Link>
                  <Link href="/auth/signin" onClick={closeMenu} className="flex-1">
                    <DiamondButton variant="primary" size="sm" className="w-full justify-center">
                      Start Free
                    </DiamondButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
