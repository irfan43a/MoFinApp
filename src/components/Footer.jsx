import React from 'react';
import { Clapperboard, Heart, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  return (
    <footer className="w-full mt-20 border-t border-slate-800/80 bg-slate-950/70 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/20 text-white">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                CinePulse
              </span>
              <p className="text-xs text-slate-400">
                Aplikasi Pencari Film & Streaming Explorer Real-Time
              </p>
            </div>
          </div>

          {/* Attribution to TMDB */}
          <div className="flex items-center gap-3 text-xs bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Didukung oleh API Real-Time resmi</span>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              The Movie Database (TMDb)
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-900 pt-6">
          <p>
            &copy; {new Date().getFullYear()} CinePulse Movie Finder. Dibuat dengan kecerdasan buatan & React.
          </p>
          <p className="flex items-center gap-1">
            Data selalu sinkron dan diperbarui setiap saat secara langsung dari server.
          </p>
        </div>
      </div>
    </footer>
  );
}
