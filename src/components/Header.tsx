"use client";

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MapPin, Phone, Settings, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { config, theme, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 shadow-xs transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
            <span className="text-lg sm:text-xl">🐾</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-stone-900 dark:text-stone-100">
                {config.businessName}
              </span>
              <span className="hidden sm:inline text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Забота 24/7
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-700 dark:text-stone-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate max-w-[90px] sm:max-w-none">г. {config.city}</span>
            </p>
          </div>
        </Link>

        {/* Действия */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Кнопка темы */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition cursor-pointer"
            title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
            aria-label="Сменить тему"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-stone-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Кабинет */}
          <Link
            href="/admin"
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            title="Кабинет владельца"
          >
            <Settings className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden md:inline">Кабинет</span>
          </Link>
          
          {/* Телефон (на мобилках компактная круглая или узкая кнопка без переноса) */}
          <a
            href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
            className="p-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-xs hover:opacity-95 transition flex items-center justify-center shrink-0"
            title={`Позвонить: ${config.phone}`}
          >
            <Phone className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline sm:ml-2 tracking-wide font-sans">{config.phone}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
