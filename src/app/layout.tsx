import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Pomodoro Timer",
  description: "A customizable Pomodoro timer for better productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} bg-[#F2F2EB] min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
