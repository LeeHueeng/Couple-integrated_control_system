// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "커플 계획표",
  description: "함께하는 계획, 더 가까워지는 우리",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <header className="header">
          <div className="container">
            <Link href="/" className="logo">
              <h1>커플 통합관제 시스템</h1>
            </Link>
            <Navbar />
          </div>
        </header>
        <main>
          <div className="mainContent">{children}</div>
        </main>
        <footer className="footer">
          <div className="container">
            <p>
              &copy; {new Date().getFullYear()} 커플 계획표. All rights
              reserved.
            </p>
            <p>hueeng 제작 | 개발자 연락처 이메일: zzxx373014@gmail.com</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
