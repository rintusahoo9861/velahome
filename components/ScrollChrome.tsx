"use client";

import { useEffect, useState } from "react";
import { WA_GALLERY } from "@/lib/homes";
import { prefersReducedMotion } from "@/lib/hooks";
import { EnquireButton } from "./SiteProvider";

const SPY: [string, string][] = [
  ["#main", "Main"],
  ["#catalog", "Catalog"],
  ["#finder", "Budget"],
  ["#consult", "Consult"],
];

/** Reading-progress bar, the floating quick nav and the phone action dock. */
export default function ScrollChrome() {
  const [show, setShow] = useState(false);
  const [cur, setCur] = useState("#main");

  useEffect(() => {
    const root = document.documentElement;
    const frame = document.getElementById("main");
    const rm = prefersReducedMotion();
    let tk = false;

    const spy = () => {
      const m = window.innerHeight * 0.4;
      let c = SPY[0][0];
      SPY.forEach(([href]) => {
        const s = document.querySelector(href);
        if (s && s.getBoundingClientRect().top <= m) c = href;
      });
      setCur(c);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const H = frame?.offsetHeight ?? 0;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--sp", max > 0 ? (y / max).toFixed(4) : "0");
      /* hero parallax: the wordmark lifts and fades, the photo sinks */
      if (!rm && frame) frame.style.setProperty("--p", Math.min(1, Math.max(0, y / H)).toFixed(4));
      setShow(y > H - 140);
      spy();
      tk = false;
    };
    const queue = () => {
      if (!tk) {
        tk = true;
        requestAnimationFrame(onScroll);
      }
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    onScroll();
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return (
    <>
      <div className="prog" aria-hidden="true"></div>
      <nav className={`pnav${show ? " show" : ""}`} aria-label="Quick">
        {SPY.map(([href, label]) => (
          <a key={href} href={href} className={cur === href ? "cur" : undefined}>
            {label}
          </a>
        ))}
        <EnquireButton source="Floating nav">Enquire</EnquireButton>
      </nav>
      <div className="dock">
        <EnquireButton source="Dock">Enquire</EnquireButton>
        <a className="wa" href={WA_GALLERY}>
          WhatsApp
        </a>
      </div>
    </>
  );
}
