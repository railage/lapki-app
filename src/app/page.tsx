"use client";

import { Header } from "@/components/Header";
import { Calculator } from "@/components/Calculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200 pb-16">
      <Header />
      <Calculator />
      
      {/* Чистый футер без new Date() */}
      <footer className="mt-12 border-t border-stone-200/80 dark:border-stone-800 py-8 text-center text-xs text-stone-700 dark:text-stone-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🐾</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">Лапки</span>
            <span>— заботливый сервис ухода за питомцами</span>
          </div>
          <div>
            © 2026 Все права защищены
          </div>
        </div>
      </footer>
    </main>
  );
}
