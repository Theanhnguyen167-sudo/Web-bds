'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, Layers, PlusCircle, User, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-primary tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-extrabold text-foreground">HANOI <span className="text-primary">PROPTECH</span></span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">BĐS & Quy Hoạch AI</span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary text-foreground/80">
            Bản đồ BĐS
          </Link>
          <Link href="/planning" className="flex items-center gap-1.5 transition-colors hover:text-primary text-foreground/80">
            <Layers className="h-4 w-4 text-emerald-600" />
            Tra cứu Quy hoạch
          </Link>
          <Link href="/reports/demo" className="flex items-center gap-1.5 transition-colors hover:text-primary text-foreground/80">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Thẩm định AI
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-primary text-foreground/80">
            Bảng giá
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/listings/create"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Đăng tin mới
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3.5 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <User className="h-4 w-4" />
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
};
