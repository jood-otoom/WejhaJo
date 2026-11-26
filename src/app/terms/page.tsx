import Link from "next/link";
import { CompanyEmailLink } from "@/components/layout/company-email-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using the Wejha website and exploring its portfolio showcases.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | Wejha",
    description: "Terms for using Wejha’s website and portfolio showcases.",
    url: "/terms",
    images: ["/opengraph-image"],
  },
};

export default function Terms() {
  return (
    <article className="section shell legal-page">
      <h1>Terms of Use</h1>
      <p>These terms apply to your use of the Wejha website.</p>
      <h2>Website content and previews</h2>
      <p>
        This site provides general information about Wejha’s services, products
        and capabilities. Interactive previews use illustrative data. Sample
        reservations, forecasts, documents and other demo interactions have no
        operational or contractual effect.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Use the website lawfully and respect its availability and integrity.
        Please avoid automated spam, attempts to interfere with the site and
        submission of confidential or unauthorized information.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The Wejha name, logo and original website content are owned by Wejha or
        used with permission. Third-party assets are subject to their applicable
        licenses.
      </p>
      <h2>Inquiries</h2>
      <p>
        Submitting an inquiry starts a conversation. Any services, timing or
        deliverables are agreed separately. For questions about these terms,
        email <CompanyEmailLink /> or use the{" "}
        <Link href="/#contact">contact form</Link>.
      </p>
    </article>
  );
}
