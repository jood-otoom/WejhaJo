import Image from "next/image";
import {
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Check,
  Code2,
  Database,
  GraduationCap,
  HeartHandshake,
  Layers3,
  Plug,
  Server,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Trophy,
  Workflow,
} from "lucide-react";
import { industries, toolkit } from "@/data/company";
import { services } from "@/data/services";
import { ProcessTimeline } from "./process-timeline";
import { SectionHeading } from "./section-heading";

const serviceIcons = {
  ai: BrainCircuit,
  mobile: Smartphone,
  web: Code2,
  enterprise: Layers3,
  data: ChartNoAxesCombined,
  automation: Workflow,
};
const industryIcons = [
  HeartHandshake,
  BriefcaseBusiness,
  ShoppingBag,
  Trophy,
  GraduationCap,
  Sparkles,
];
const toolkitIcons = [
  Code2,
  Server,
  Smartphone,
  BrainCircuit,
  Database,
  Layers3,
  Plug,
];

export function About() {
  return (
    <>
      <section
        className="section dark story-section"
        id="about"
        tabIndex={-1}
        aria-labelledby="story-heading"
      >
        <div className="shell story-grid">
          <div>
            <SectionHeading
              label="Our founders’ story"
              id="story-heading"
              title="Born from Change."
            />
            <p>
              When the pandemic changed how organizations worked in 2020, we
              began helping businesses and NGOs digitalize their operations,
              automate processes and adapt.
            </p>
            <p>
              After years of working together, we officially registered Wejha in
              2026. Today, we build technology that makes a meaningful
              difference in how people work.
            </p>
          </div>
          <ol className="timeline">
            <li>
              <strong>2020</strong>
              <span>Helping organizations adapt to new ways of working.</span>
            </li>
            <li>
              <strong>2021–2025</strong>
              <span>Building solutions and growing our shared experience.</span>
            </li>
            <li>
              <strong>2026</strong>
              <span>Wejha is officially registered.</span>
            </li>
          </ol>
        </div>
      </section>
      <section
        className="section purpose-section"
        aria-labelledby="purpose-heading"
      >
        <div className="shell">
          <SectionHeading
            label="Our purpose"
            id="purpose-heading"
            title="Technology that makes a meaningful difference."
          />
          <div className="purpose-grid">
            <article>
              <p className="eyebrow">Mission</p>
              <h3>Make technology work for people.</h3>
              <p>
                Help businesses and organizations simplify operations, make
                informed decisions, and create sustainable value through
                intelligent digital solutions.
              </p>
            </article>
            <article>
              <p className="eyebrow">Vision</p>
              <h3>A more connected, capable future.</h3>
              <p>
                Become a trusted technology partner for organizations building a
                smarter, more connected, and impactful future.
              </p>
            </article>
            <article>
              <p className="eyebrow">Values</p>
              <h3>Impact. Integrity. Partnership.</h3>
              <ul>
                {[
                  "Meaningful impact",
                  "Integrity",
                  "Innovation",
                  "Human-centered design",
                  "Long-term partnership",
                ].map((value) => (
                  <li key={value}>
                    <Check size={15} aria-hidden="true" />
                    {value}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

export function Services() {
  return (
    <section
      className="section services-section"
      id="services"
      tabIndex={-1}
      aria-labelledby="services-heading"
    >
      <div className="shell">
        <SectionHeading
          label="What we do"
          id="services-heading"
          title="Solutions that move you forward."
        >
          From the first idea to everyday operations, we bring technology and
          people together.
        </SectionHeading>
        <div className="card-grid">
          {services.map(({ id, name, description, capabilities }) => {
            const Icon = serviceIcons[id];
            return (
              <article
                className="card service-card"
                id={`service-${id}`}
                key={id}
              >
                <span className="icon-tile">
                  <Icon size={23} aria-hidden="true" />
                </span>
                <h3>{name}</h3>
                <p>{description}</p>
                <ul>
                  {capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section
      className="section"
      id="industries"
      aria-labelledby="industries-heading"
    >
      <div className="shell">
        <SectionHeading
          label="Who we serve"
          id="industries-heading"
          title="Across industries. Around people."
        />
        <div className="industry-grid">
          {industries.map(({ name, description }, index) => {
            const Icon = industryIcons[index];
            return (
              <article key={name}>
                <Icon size={22} aria-hidden="true" />
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Approach() {
  return (
    <>
      <section
        className="section process-section"
        id="process"
        tabIndex={-1}
        aria-labelledby="process-heading"
      >
        <div className="shell">
          <SectionHeading
            label="How we work"
            id="process-heading"
            title="From vision to everyday impact."
          >
            We plan for rollout, staff adoption and the work that comes after
            launch.
          </SectionHeading>
          <ProcessTimeline />
        </div>
      </section>
      <section
        aria-labelledby="delivery-heading"
        className="section delivery-section"
      >
        <div className="shell">
          <div className="training">
            <div>
              <SectionHeading
                label="Beyond delivery"
                id="delivery-heading"
                title="Technology is only half the journey."
              />
              <p>
                Our dedicated trainers work side by side with your staff, making
                the transition to a new system feel natural. Through hands-on
                training and friendly guidance, we help your people build the
                confidence to make technology part of their everyday work.
              </p>
            </div>
            <ul>
              {[
                "Personalized staff onboarding",
                "Practical, hands-on training",
                "User guides and learning resources",
                "Ongoing technical support",
              ].map((item) => (
                <li key={item}>
                  <Check size={19} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export function Toolkit() {
  return (
    <section
      className="section toolkit-section"
      aria-labelledby="toolkit-heading"
    >
      <div className="shell">
        <SectionHeading
          label="Engineering toolkit"
          id="toolkit-heading"
          title="Technologies we work with."
        />
        <div className="toolkit-grid">
          {toolkit.map(({ name, technologies }, index) => {
            const Icon = toolkitIcons[index];
            return (
              <article key={name}>
                <Icon size={19} aria-hidden="true" />
                <div>
                  <h3>{name}</h3>
                  <p>
                    {technologies.map((technology, position) => (
                      <span key={technology}>
                        {position > 0 && " · "}
                        {technology === "Python" && (
                          <Image
                            className="technology-icon"
                            src="/icons/python.png"
                            alt=""
                            width={13}
                            height={16}
                            unoptimized
                          />
                        )}
                        {technology}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
