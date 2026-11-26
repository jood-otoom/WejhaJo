import Link from "next/link";
import { CompanyEmailLink } from "@/components/layout/company-email-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Wejha handles website inquiries, protects contact details and uses service providers.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Wejha",
    description: "How Wejha handles inquiries and contact details.",
    url: "/privacy",
    images: ["/opengraph-image"],
  },
};

export default function Privacy() {
  return (
    <article className="section shell legal-page">
      <h1>Privacy Policy</h1>
      <p>
        This policy describes how Wejha handles information shared through this
        website.
      </p>
      <h2>Information you share</h2>
      <p>
        When you send an inquiry, we collect your name, email address, service
        of interest and project description, along with your organization and
        phone number if you provide them. We use this information to review and
        respond to your inquiry and to follow up about your project.
      </p>
      <h2>Service providers and website security</h2>
      <p>
        Cloudflare hosts this website and may process technical request data for
        hosting and security. Cloudflare Email Sending delivers form inquiries
        to our company inbox with your email address set for replies. Cloudflare
        also uses the request IP address for short-lived abuse prevention
        counters. The website does not store inquiry messages in a database.
        Authorized staff may retain inquiry correspondence in the company inbox.
        Portfolio previews use local sample data and do not send demo inputs to
        a service provider.
      </p>
      <h2>Retention and access</h2>
      <p>
        We keep inquiry correspondence as needed to respond, maintain business
        records and meet applicable legal obligations. To ask about our handling
        of your information or request access, correction or deletion, contact
        us through the website.
      </p>
      <h2>Contact</h2>
      <p>
        Wejha is based in Amman, Jordan. For privacy questions and requests,
        email <CompanyEmailLink /> or use the{" "}
        <Link href="/#contact">contact form</Link>.
      </p>
    </article>
  );
}
