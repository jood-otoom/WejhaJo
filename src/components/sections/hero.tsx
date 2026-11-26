"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BrainCircuit,
  Code2,
  Network,
  Users,
} from "lucide-react";
import { LazyMotion, domAnimation, m, MotionConfig } from "motion/react";

const nodes = [
  { name: "AI & data", icon: BrainCircuit, position: "top-start" },
  { name: "Software", icon: Code2, position: "top-end" },
  { name: "Organizations", icon: Network, position: "bottom-start" },
  { name: "People", icon: Users, position: "bottom-end" },
];

export function Hero() {
  return (
    <>
      <section
        className="hero dark"
        id="home"
        tabIndex={-1}
        aria-labelledby="hero-heading"
      >
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              Software engineering · AI · Digital transformation
            </p>
            <h1 id="hero-heading">
              Technology
              <br />
              <span className="hero-title-line">
                with <em>Purpose.</em>
              </span>
            </h1>
            <p className="hero-description">
              We build intelligent software and AI solutions that help
              businesses and organizations work smarter, grow confidently, and
              create lasting value.
            </p>
            <div className="actions">
              <a className="button" href="#work">
                Explore Our Work <ArrowUpRight size={18} />
              </a>
              <a className="button button-outline" href="#contact">
                Get in Touch
              </a>
            </div>
          </div>
          <MotionConfig reducedMotion="user">
            <LazyMotion features={domAnimation}>
              <m.div
                className="hero-art"
                initial={false}
                animate={{ y: [6, 0] }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                aria-hidden="true"
              >
                <div className="art-header">
                  <span>Wejha / Connected systems</span>
                  <Network size={17} />
                </div>
                <div className="network-art">
                  <svg viewBox="0 0 420 254" preserveAspectRatio="none">
                    <defs>
                      <radialGradient id="network-glow">
                        <stop stopColor="#80B4FF" stopOpacity=".24" />
                        <stop offset="1" stopColor="#80B4FF" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle
                      cx="210"
                      cy="127"
                      r="115"
                      fill="url(#network-glow)"
                    />
                    <g fill="none" stroke="#557bad" strokeWidth="1">
                      <circle cx="210" cy="127" r="92" />
                      <circle cx="210" cy="127" r="66" />
                      <path
                        d="M210 127 75 56M210 127 345 56M210 127 75 198M210 127 345 198"
                        strokeDasharray="4 5"
                      />
                    </g>
                    <g fill="#80B4FF">
                      <circle cx="210" cy="35" r="3" />
                      <circle cx="210" cy="219" r="3" />
                      <circle cx="118" cy="127" r="3" />
                      <circle cx="302" cy="127" r="3" />
                    </g>
                  </svg>
                  <span className="network-core">
                    <Image
                      src="/brand/wejha-mark.webp"
                      width={55}
                      height={33}
                      alt=""
                      priority
                    />
                  </span>
                  {nodes.map(({ name, icon: Icon, position }) => (
                    <span className={`network-node ${position}`} key={name}>
                      <Icon size={16} />
                      {name}
                    </span>
                  ))}
                </div>
                <div className="art-footer">
                  <span>Systems that work.</span>
                  <span>People who thrive.</span>
                </div>
              </m.div>
            </LazyMotion>
          </MotionConfig>
        </div>
      </section>
      <div className="brand-strip">
        <div className="shell">
          <span>Our journey began in 2020</span>
          <span>Officially registered in 2026</span>
          <strong>Built for businesses. Designed for people.</strong>
        </div>
      </div>
    </>
  );
}
