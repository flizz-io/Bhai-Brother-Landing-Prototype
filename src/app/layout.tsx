import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./cinema.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel with bhai brothers | The Brotherhood Adventure Chronicles",
  description: "আমাদের ভাই-ব্রাদার্স ট্যুর ডায়েরি ও মেমোরি ভল্ট। বন্ধুত্বের ভ্রমণ কাহিনী, ক্যাম্পিং রাত, রোমাঞ্চকর পাহাড় ট্র্যাকিং ও স্মরণীয় মুহূর্তের ইন্টারেক্টিভ আর্কাইভ।",
  keywords: ["Travel with bhai brothers", "Tour Diary", "Sajek Valley", "Bandarban", "Cox's Bazar", "Tanguar Haor", "Adventure Memories"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('bhai-brothers-theme');
                  if (saved === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  } else if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                    if (prefersLight) {
                      document.documentElement.classList.add('light');
                      document.documentElement.classList.remove('dark');
                    } else {
                      document.documentElement.classList.add('dark');
                      document.documentElement.classList.remove('light');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full m-0 bg-[#040d1a] text-white selection:bg-[#0284c7] selection:text-white transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
