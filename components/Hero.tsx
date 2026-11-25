"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { PHONE } from "@/lib/homes";
import { EnquireButton, useSite } from "./SiteProvider";

const WORD = "VelaHome";

export default function Hero() {
  const frame = useRef<HTMLElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const [time, setTime] = useState<"day" | "dusk">("day");
  const [pill, setPill] = useState("#main");
  const { setMenuOpen, menuOpen } = useSite();

  /* fit the giant wordmark to the frame width */
  useEffect(() => {
    const w = word.current;
    const f = frame.current;
    if (!w || !f) return;
    const fit = () => {
      const wrap = w.parentElement!;
      w.style.fontSize = "100px";
      const width = w.getBoundingClientRect().width;
      const target = Math.min(wrap.clientWidth, f.clientHeight * 2.0);
      w.style.fontSize = (100 * target) / width + "px";
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  /* pointer depth on the hero photo */
  useEffect(() => {
    const f = frame.current;
    if (!f) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches || !window.matchMedia("(pointer:fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = f.getBoundingClientRect();
      f.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      f.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    f.addEventListener("pointermove", move);
    return () => f.removeEventListener("pointermove", move);
  }, []);

  const pills: [string, string][] = [
    ["#main", "Main"],
    ["#catalog", "Catalog"],
    ["#consult", "Consult"],
  ];

  return (
    <header className="sheet frame" id="main" data-time={time} ref={frame}>
      <div className="notch">
        <svg viewBox="0 0 440 62" preserveAspectRatio="none">
          <path d="M0 0H440C418 0 408 6 402 20L392 40C386 56 374 62 356 62H84C66 62 54 56 48 40L38 20C32 6 22 0 0 0Z" fill="#0c0c0c" />
        </svg>
        <nav aria-label="Primary">
          {pills.map(([href, label]) => (
            <a key={href} className={`pill${pill === href ? " on" : ""}`} href={href} onClick={() => setPill(href)}>
              {label}
            </a>
          ))}
        </nav>
      </div>
      <a className="topl" href="#main" aria-label="VelaHome">
        <svg viewBox="0 0 26 20" fill="none" stroke="#111" strokeWidth="1.4">
          <path d="M1 19V8l6-5 6 5v11M13 19V10l6-4 6 4v9M1 19h24" />
        </svg>
        Vela<sup style={{ fontSize: 8 }}>®</sup>
      </a>
      <div className="topr">
        <EnquireButton className="ic hide-m" aria-label="Search homes" source="Search">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l4 4" />
          </svg>
        </EnquireButton>
        <EnquireButton className="contact" source="Top bar">
          Contact
        </EnquireButton>
        <a className="ic" href={`tel:${PHONE}`} aria-label="Call VelaHome">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.5 1.5l2 .5.9 2.6-1.4 1.2a8 8 0 004.7 4.7l1.2-1.4 2.6.9.5 2c.1.6-.3 1.2-.9 1.3C7.5 14.1 1.9 8.5 2.2 2.4c.1-.6.7-1 1.3-.9z" />
          </svg>
        </a>
        <button className="burger" aria-label="Open menu" id="burger" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
          <i></i>
          <i></i>
        </button>
      </div>
      <div className="crumbs">
        Your <b>·</b> Dream <b>·</b> Property <b>·</b> Awards
      </div>
      <div className="word-wrap">
        <h1 className="word" ref={word} aria-label={WORD}>
          {[...WORD].map((c, i) => (
            <span className="l" key={i}>
              <span style={{ "--i": i } as CSSProperties}>{c}</span>
            </span>
          ))}
        </h1>
      </div>
      <div className="tools">
        <a className="so" href="#consult" aria-label="Instagram">
          <svg viewBox="0 0 16 16" fill="none" stroke="#111" strokeWidth="1.4">
            <rect x="2" y="2" width="12" height="12" rx="3.5" />
            <circle cx="8" cy="8" r="2.8" />
          </svg>
        </a>
        <a className="so" href="#consult" aria-label="WhatsApp">
          <svg viewBox="0 0 16 16" fill="none" stroke="#111" strokeWidth="1.4">
            <path d="M2 14l1-3.2A6 6 0 118.2 14a6 6 0 01-3-.8z" />
          </svg>
        </a>
        <a className="so" href="#consult" aria-label="X">
          <svg viewBox="0 0 16 16" fill="none" stroke="#111" strokeWidth="1.5">
            <path d="M2 2l12 12M14 2L2 14" />
          </svg>
        </a>
        <span className="swatches" title="Materials: teak, walnut, glass, concrete, moss, clay">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span className="time" role="group" aria-label="Time of day">
          <button aria-pressed={time === "day"} onClick={() => setTime("day")}>
            Daylight
          </button>
          <button aria-pressed={time === "dusk"} onClick={() => setTime("dusk")}>
            Dusk
          </button>
        </span>
      </div>
      <div className="card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="photo" src="/back.jpg" alt="" fetchPriority="high" />
        <div className="dusk-o"></div>
      </div>
      <div className="hz">
        <div className="gs"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="house" src="/house.webp" alt="Modern timber, glass and concrete villa with a cantilevered teak roof" fetchPriority="high" />
      </div>
      <div className="info">
        <svg viewBox="0 0 16 16" fill="none" stroke="#111" strokeWidth="1.3">
          <circle cx="8" cy="8" r="2.4" />
          <path d="M1 8c2-3.4 4.4-5 7-5s5 1.6 7 5c-2 3.4-4.4 5-7 5S3 11.4 1 8z" />
        </svg>
        <span>Dedicated to personal service — helping your family find the one home that fits</span>
      </div>
      <svg className="star" viewBox="0 0 46 46" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
        <path d="M23 2v42M2 23h42M8 8l30 30M38 8L8 38" opacity=".9" />
      </svg>
      <div className="stats">
        <div className="stat">
          <strong>+340</strong>
          <p>families moved in and left reviews about the way we work</p>
          <div className="faces">
            <i>AR</i>
            <i>SK</i>
            <i>MN</i>
          </div>
        </div>
        <div className="stat photo">
          <div className="th" style={{ background: "url(/back.jpg) 60% 70%/cover" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/house.webp" alt="" style={{ position: "absolute", left: "50%", bottom: 3, width: "94%", transform: "translateX(-50%)" }} />
          </div>
          <strong>186</strong>
          <p>homes handed over since 2019, 91% already lived in</p>
          <a className="go" href="#catalog" aria-label="See homes">
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2 12L12 2M5 2h7v7" />
            </svg>
          </a>
        </div>
      </div>
      <p className="demo-tag">Demo concept · sample listings and figures are not real</p>
    </header>
  );
}
