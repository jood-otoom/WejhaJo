import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";
import { Hero } from "@/components/sections/hero";
import {
  About,
  Approach,
  Industries,
  Services,
  Toolkit,
} from "@/components/sections/company";
import { Contact } from "@/components/sections/contact";
import { SectionHeading } from "@/components/sections/section-heading";
import { Portfolio } from "@/components/projects/portfolio";
import { ImpactPreview } from "@/components/dashboards/showcase-loaders";
import { site, siteUrl } from "@/config/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "Wejha | Technology with Purpose",
    description: site.description,
    siteName: site.name,
    type: "website",
    images: ["/opengraph-image"],
  },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: siteUrl.href,
  logo: new URL("/brand/favicon.png", siteUrl).href,
  description: site.description,
  slogan: site.slogan,
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amman",
    addressCountry: "JO",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <About />
      <Services />
      <section
        className="section portfolio-section"
        id="work"
        tabIndex={-1}
        aria-labelledby="portfolio-heading"
      >
        <div className="shell">
          <SectionHeading
            label="Our products & solutions"
            id="portfolio-heading"
            title="Technology built around real needs."
          >
            Explore GoTime and our solution showcases across software, AI and
            data science.
          </SectionHeading>
          <Portfolio />
          <div className="impact-feature">
            <div>
              <span className="icon-tile">
                <ChartNoAxesCombined size={23} aria-hidden="true" />
              </span>
              <p className="eyebrow">Explore our capabilities</p>
              <h3>Data that drives better decisions.</h3>
              <p>
                Explore how interactive reporting, regional maps and performance
                indicators can help teams understand progress and plan their
                next steps.
              </p>
              <ul className="impact-features">
                <li>
                  <MapPin size={17} /> Governorate-level mapping
                </li>
                <li>
                  <SlidersHorizontal size={17} /> Filterable performance
                  indicators
                </li>
              </ul>
              <Link
                href="/projects/business-intelligence-platform"
                className="text-link"
              >
                Explore business intelligence <ArrowUpRight size={16} />
              </Link>
            </div>
            <ImpactPreview />
          </div>
        </div>
      </section>
      <Industries />
      <Approach />
      <Toolkit />
      <Contact />
    </>
  );
}
