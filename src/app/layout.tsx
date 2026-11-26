import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { allowIndexing, site, siteUrl } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Wejha | Technology with Purpose",
    template: "%s | Wejha",
  },
  description: site.description,
  applicationName: site.name,
  other: { contact: site.email },
  robots: { index: allowIndexing, follow: allowIndexing },
  icons: { icon: "/brand/favicon.png", apple: "/brand/favicon.png" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: "Wejha | Technology with Purpose",
    description: site.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Wejha — Technology with Purpose",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.language} dir={site.direction}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
