"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { businessConfig } from "@/src/config/business";
import { trackConversion } from "./analytics";

const navItems = [
  ["Services", "/services"],
  ["Pricing", "/pricing"],
  ["Service Area", "/service-area"],
  ["About", "/about"],
  ["FAQ", "/faq"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link
          className="brand-link"
          href="/"
          aria-label={`${businessConfig.name} home`}
        >
          <Image
            src={businessConfig.brand.logo}
            alt={businessConfig.name}
            width="216"
            height="162"
            priority
          />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="header-phone"
            href={`tel:${businessConfig.phone}`}
            onClick={() =>
              trackConversion("phone_click", { context: "header" })
            }
          >
            {businessConfig.phone}
          </a>
          <a
            className="button button--header"
            href={`mailto:${businessConfig.email}`}
            onClick={() =>
              trackConversion("email_click", { context: "header" })
            }
          >
            Email Us
          </a>
        </div>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-menu" ref={menuRef}>
          <nav className="container" aria-label="Mobile navigation">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/schedule-service" onClick={() => setOpen(false)}>
              Schedule Service
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
