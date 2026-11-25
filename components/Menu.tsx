"use client";

import { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MAPS_URL, PHONE, PHONE_LABEL } from "@/lib/homes";
import { prefersReducedMotion, useFocusTrap } from "@/lib/hooks";
import { useSite } from "./SiteProvider";

const Svg = ({ children, sw = 1.9 }: { children: ReactNode; sw?: number }) => (
  <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const ROWS: { href: string; label: string; hint: string; title: string; text: string; img: string; icon: ReactNode }[] = [
  {
    href: "#main", label: "Main", hint: "Back to the top", title: "Where it begins", text: "The villa, the team and how we build.", img: "/m1.jpg",
    icon: <path d="M3.5 12.5 14 4l10.5 8.5M6 11v11.5h16V11M11.5 22.5v-7h5v7" />,
  },
  {
    href: "#catalog", label: "Catalog", hint: "Six homes to compare", title: "Browse the homes", text: "Six homes across Hyderabad, filtered by type.", img: "/m2.jpg",
    icon: <path d="m14 4 10 5-10 5L4 9zM4 14l10 5 10-5M4 19l10 5 10-5" />,
  },
  {
    href: "#finder", label: "Budget", hint: "Slide to your comfort", title: "Plan within your budget", text: "Explore smart options that fit your financial goals.", img: "/m3.jpg",
    icon: (
      <>
        <rect x="5.5" y="3.5" width="17" height="21" rx="3" />
        <path d="M9 8.5h10" />
        <path d="M9.5 13h.01M14 13h.01M18.5 13h.01M9.5 17h.01M14 17h.01M18.5 17h.01M9.5 21h.01M14 21h.01M18.5 21h.01" strokeWidth="2.6" />
      </>
    ),
  },
  {
    href: "#consult", label: "Consult", hint: "Four steps to handover", title: "Talk it through", text: "Four steps, from first gallery visit to handover.", img: "/m4.jpg",
    icon: <path d="M14 4.5c5.5 0 10 3.4 10 7.7S19.500 20 14 20c-1.200 0-2.300-.2-3.300-.5L5 22l1.400-4.300C4.800 16.200 4 14.300 4 12.200 4 7.900 8.500 4.500 14 4.500z" />,
  },
  {
    href: "#faq", label: "Questions", hint: "Quick, honest answers", title: "Quick answers", text: "Visits, home loans, what’s in the price, build time.", img: "/m5.jpg",
    icon: (
      <>
        <circle cx="14" cy="14" r="10" />
        <path d="M10.800 11.200a3.300 3.300 0 1 1 4.600 3c-.9.500-1.400 1.100-1.400 2.100M14 20h.01" strokeWidth="2" />
      </>
    ),
  },
];

export default function Menu() {
  const { menuOpen, setMenuOpen } = useSite();
  const [shown, setShown] = useState(false);
  const [out, setOut] = useState(false);
  const [cur, setCur] = useState(2);
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const tm = useRef(0);
  const warm = useRef(false);
  const afterClose = useRef<(() => void) | null>(null);

  useFocusTrap(root, shown, "a[href],button");

  /* which section is on screen now */
  const here = () => {
    let k = 0;
    ROWS.forEach((r, i) => {
      const e = document.querySelector(r.href);
      if (e && e.getBoundingClientRect().top <= window.innerHeight * 0.45) k = i;
    });
    return k;
  };

  /* open */
  useEffect(() => {
    if (!menuOpen) return;
    if (!warm.current) {
      warm.current = true;
      ROWS.forEach((r) => (new Image().src = r.img));
    }
    setCur(here());
    window.clearTimeout(tm.current);
    setOut(false);
    setShown(true);
    document.documentElement.style.overflow = "hidden";
  }, [menuOpen]);

  /* focus the close button once the menu is actually on screen */
  useEffect(() => {
    if (shown) closeBtn.current?.focus({ preventScroll: true });
  }, [shown]);

  const shut = useCallback(
    (cb?: () => void) => {
      afterClose.current = cb ?? null;
      setOut(true);
      window.clearTimeout(tm.current);
      tm.current = window.setTimeout(
        () => {
          setShown(false);
          setOut(false);
          setMenuOpen(false);
          document.documentElement.style.overflow = "";
          if (afterClose.current) afterClose.current();
          else document.getElementById("burger")?.focus({ preventScroll: true });
        },
        prefersReducedMotion() ? 0 : 340
      );
    },
    [setMenuOpen]
  );

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && shut();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shown, shut]);

  useEffect(() => () => window.clearTimeout(tm.current), []);

  function rowClick(e: React.MouseEvent, i: number) {
    e.preventDefault();
    const touch = window.matchMedia("(hover:none)").matches;
    /* on touch screens the first tap previews, the second goes */
    if (touch && cur !== i) {
      setCur(i);
      return;
    }
    setCur(i);
    const tg = document.querySelector(ROWS[i].href);
    const rm = prefersReducedMotion();
    window.clearTimeout(tm.current);
    tm.current = window.setTimeout(() => shut(() => tg?.scrollIntoView({ behavior: rm ? "auto" : "smooth" })), rm ? 0 : 560);
  }

  return (
    <div className={`menu${shown ? " mopen" : ""}${out ? " out" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu" ref={root}>
      <div className="mst">
        <a className="mlogo" href="#main" aria-label="VelaHome">
          <svg viewBox="0 0 50 44" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
            <path d="M4 20 25 3l21 17v21H4z" />
            <path d="M25 3v38M17 41V28h16v13" />
          </svg>
          <span>VelaHome</span>
        </a>
        <button className="mclose" aria-label="Close menu" ref={closeBtn} onClick={() => shut()}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </button>
        <div className="mpic" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mphoto.png" alt="" width="780" height="770" />
        </div>
        <div className="mline" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mline.png" alt="" width="780" height="770" />
        </div>
        <div className="mhead">
          <p className="mey">Explore</p>
          <span className="mbar"></span>
          <h2 className="mhd">
            <span>
              <u>Find</u>
            </span>
            <span>
              <u>Your</u>
            </span>
            <span>
              <u>Space</u>
            </span>
          </h2>
          <p className="msub">
            Thoughtful homes <br />
            for modern living.
          </p>
        </div>
        <nav className="ml" aria-label="Site sections">
          {ROWS.map((r, i) => (
            <a
              key={r.href}
              className={`mi${cur === i ? " sel" : ""}`}
              href={r.href}
              style={{ "--i": i } as CSSProperties}
              onClick={(e) => rowClick(e, i)}
              onFocus={(e) => e.currentTarget.matches(":focus-visible") && setCur(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const n = (i + (e.key === "ArrowDown" ? 1 : ROWS.length - 1)) % ROWS.length;
                  (root.current?.querySelectorAll<HTMLElement>(".mi")[n])?.focus();
                }
              }}
            >
              <span className="mit">
                <Svg>{r.icon}</Svg>
              </span>
              <span className="mil">
                <b>{r.label}</b>
                <em>{r.hint}</em>
              </span>
              <span className="min" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="mia">
                <Svg sw={2.2}>
                  <path d="M4 14h20M16 6l8 8-8 8" />
                </Svg>
              </span>
            </a>
          ))}
        </nav>
        <aside className="mp" aria-live="polite" style={{ "--s": cur } as CSSProperties}>
          <span className="mcn" aria-hidden="true"></span>
          <div className="mpimg" aria-hidden="true">
            {ROWS.map((r, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={r.img} className={cur === i ? "sel" : undefined} src={r.img} alt="" width="480" height="436" decoding="async" />
            ))}
          </div>
          <span className="mdv" aria-hidden="true"></span>
          <div className="mpt">
            <span className="mab" aria-hidden="true"></span>
            {ROWS.map((r, i) => (
              <div key={r.title} className={`mpx${cur === i ? " sel" : ""}`}>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </aside>
        <div className="mfoot">
          <a className="mf mf1" href={MAPS_URL} target="_blank" rel="noopener">
            <Svg sw={2}>
              <path d="M14 25s8-6.500 8-12.500a8 8 0 1 0-16 0C6 18.500 14 25 14 25Z" />
              <circle cx="14" cy="12.500" r="3" />
            </Svg>
            <span>
              Sales gallery <s>·</s> Kokapet, Hyderabad
            </span>
          </a>
          <span className="mfd" aria-hidden="true"></span>
          <a className="mf mf2" href={`tel:${PHONE}`}>
            <Svg sw={2}>
              <path d="M6 4.500h4.500l2 5.500-2.700 1.800a14 14 0 0 0 6.400 6.400l1.800-2.700 5.500 2V22a2.500 2.500 0 0 1-2.500 2.500A18 18 0 0 1 3.500 7 2.500 2.500 0 0 1 6 4.500Z" />
            </Svg>
            <span>{PHONE_LABEL}</span>
          </a>
          <span className="mfd mfd2" aria-hidden="true"></span>
          <div className="mf mf3">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4.5" />
                <circle cx="12" cy="12" r="3.6" />
                <circle cx="16.8" cy="7.2" r=".8" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                <path d="M10 9.2v5.6l4.7-2.8z" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M5.2 9.2h2.9V19H5.2zM6.65 4.6a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4M10.2 9.2H13v1.3h.04c.4-.75 1.35-1.55 2.8-1.55 3 0 3.55 1.95 3.55 4.5V19h-2.9v-4.7c0-1.1 0-2.55-1.55-2.55s-1.8 1.2-1.8 2.45V19h-2.9z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
