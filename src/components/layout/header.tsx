"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/config/site";
import { Brand } from "./brand";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const sections = navigation.flatMap(
      ({ id }) => document.getElementById(id) ?? [],
    );
    function update() {
      const threshold = 160;
      const current = sections.findLast(
        (section) => section.getBoundingClientRect().top <= threshold,
      );
      setActive(current?.id ?? "home");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      document.getElementById("menu-toggle")?.focus();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="shell header-row">
        <Brand />
        <button
          className="menu-toggle"
          id="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={open ? "main-nav is-open" : "main-nav"}
        >
          {navigation.map(({ id, label }) => (
            <a
              key={id}
              href={isHome ? `#${id}` : `/#${id}`}
              aria-current={isHome && active === id ? "location" : undefined}
              onClick={() => {
                setOpen(false);
                setActive(id);
                if (open && isHome)
                  document.getElementById(id)?.focus({ preventScroll: true });
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          className="button header-cta"
          href={isHome ? "#contact" : "/#contact"}
          onClick={() => setOpen(false)}
        >
          Let’s talk <ArrowUpRight size={16} />
        </a>
      </div>
    </header>
  );
}
