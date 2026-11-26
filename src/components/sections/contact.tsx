import { MapPin } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { site } from "@/config/site";
import { SectionHeading } from "./section-heading";

export function Contact() {
  return (
    <section
      className="section dark contact-section"
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-heading"
    >
      <div className="shell contact-grid">
        <div>
          <SectionHeading
            label="Your next step"
            id="contact-heading"
            title="Let's build something meaningful."
          >
            Have an idea, a challenge, or a process that could work better? We’d
            love to hear from you.
          </SectionHeading>
          <p className="contact-location">
            <MapPin size={20} aria-hidden="true" /> {site.location}
          </p>
          <p className="contact-privacy">
            We use the details you share to respond to your inquiry.{" "}
            <Link href="/privacy">Privacy Policy</Link>
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
