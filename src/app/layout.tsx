import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lovelyproportion - Pequenos Frutos de Produção Própria",
  description:
    "Pequenos frutos frescos e congelados de produção própria, colhidos com cuidado em Sátão, Viseu. Mirtilos, framboesas, amoras, groselhas e morangos.",
  keywords: [
    "pequenos frutos",
    "mirtilos",
    "framboesas",
    "amoras",
    "groselhas",
    "morangos",
    "produção própria",
    "Sátão",
    "Viseu",
    "Portugal",
    "frescos",
    "congelados",
    "orgânico",
    "natural",
    "Lovelyproportion",
  ],
  authors: [{ name: "Lovelyproportion - Fruits Unipessoal Lda" }],
  icons: {
    icon: "/images/mirtilos.png",
  },
  openGraph: {
    title: "Lovelyproportion - Pequenos Frutos de Produção Própria",
    description:
      "Do campo para a sua mesa. Pequenos frutos frescos e congelados colhidos em Sátão, Viseu.",
    type: "website",
    locale: "pt_PT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
