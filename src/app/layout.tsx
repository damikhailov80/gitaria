import type { Metadata } from "next";
import { Alegreya, Alegreya_Sans } from "next/font/google";
import "./globals.css";

const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["cyrillic", "latin"],
  weight: ["800"],
});

const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Gitaria — школа игры на гитаре в Гданьске",
  description: "Индивидуальные уроки гитары в Гданьске и онлайн-видеокурс «Гитара с нуля».",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${alegreya.variable} ${alegreyaSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
