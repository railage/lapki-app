import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Лапки — Сервис заботливого выгула, передержки и груминга",
  description: "Интерактивный расчет стоимости выгула, передержки и груминга за 30 секунд. Проверенные догситтеры с кинологическим опытом.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="bg-stone-50 text-stone-900 antialiased selection:bg-amber-200">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
