import { MapPin } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";
import { navigation, site } from "@/config/site";
import { services } from "@/data/services";

export function Footer() {
  return (
    <footer className="site-footer dark">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <Brand />
            <p>
              Intelligent software and AI, built for businesses and designed for
              people.
            </p>
            <p className="footer-location">
              <MapPin size={17} aria-hidden="true" /> {site.location}
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <h2>Company</h2>
            {navigation.map(({ id, label }) => (
              <a key={id} href={`/#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <nav aria-label="Services">
            <h2>Services</h2>
            {services.map(({ id, name }) => (
              <a key={id} href={`/#service-${id}`}>
                {name}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Wejha. All rights reserved.</span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
