import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section shell legal-page">
      <h1>Page not found</h1>
      <p>The page you’re looking for may have moved.</p>
      <Link href="/" className="button">
        Back to Wejha
      </Link>
    </section>
  );
}
