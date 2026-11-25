"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { PHONE } from "@/lib/homes";
import { prefersReducedMotion } from "@/lib/hooks";
import { EnquireButton } from "./SiteProvider";

const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const FAQS: { q: string; a: string; icon: ReactNode; pics?: boolean }[] = [
  {
    q: "Can I visit a home that is still being built?",
    a: "Yes. Site visits run Tuesday to Sunday with an engineer. You will see the structure, services and finishes before they are covered.",
    icon: <path d="M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5M10 20v-6h4v6" />,
    pics: true,
  },
  {
    q: "Do you help with home loans?",
    a: "We introduce you to partner banks and prepare the paperwork pack. The loan offer itself always comes from the bank.",
    icon: (
      <>
        <ellipse cx="12" cy="5.5" rx="6.5" ry="2.6" />
        <path d="M5.5 5.5v3.6c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V5.5M5.5 9.1v3.6c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V9.1M5.5 12.7v3.6c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-3.6" />
      </>
    ),
  },
  {
    q: "What’s included in the price?",
    a: "The price list names every line: land share, construction, modular kitchen, wardrobes and parking. Registration and stamp duty are shown separately so there are no surprises.",
    icon: <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3ZM4 7.5l8 4.5 8-4.5M12 12v9" />,
  },
  {
    q: "How does the consultation work?",
    a: "You pick a slot and we walk you through the gallery and the built villa. Then we shortlist two or three homes and share a line-by-line price. Nothing to sign on day one.",
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" strokeWidth="2.4" />
      </>
    ),
  },
  {
    q: "How long does a build take?",
    a: "Each home page lists its own handover month. Cottages are quicker than villas; we give a date and update you when it moves.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.5 2.2" />
      </>
    ),
  },
];

const PICS = [
  ["/faq1.jpg", "A villa frame with scaffolding during construction"],
  ["/faq2.jpg", "The concrete structure inside a villa before finishing"],
  ["/faq3.jpg", "The same villa finished, with a lit living room"],
];

export default function Faq() {
  const sec = useRef<HTMLElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const heads = useRef<(HTMLButtonElement | null)[]>([]);
  const [cur, setCur] = useState(0);
  const [go, setGo] = useState(false);
  const curRef = useRef({ cur: 0, last: 0 });

  function set(i: number) {
    curRef.current.cur = i;
    if (i >= 0) curRef.current.last = i;
    /* toggled directly: the animation loop also adds .rdy to this element */
    ring.current?.classList.toggle("off", i < 0);
    setCur(i);
  }

  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setGo(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* the green ring glides to the open question */
  useEffect(() => {
    const rm = prefersReducedMotion();
    let ry = 0, rh = 60, first = true, raf = 0;
    const tick = () => {
      const el = sec.current;
      const rg = ring.current;
      if (el && rg) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom > -120 && r.top < vh + 120) {
          const { cur: c, last } = curRef.current;
          const it = items.current[c >= 0 ? c : last];
          if (it) {
            const ty = it.offsetTop, th = it.offsetHeight;
            if (first) {
              ry = ty;
              rh = th;
              first = false;
            }
            const k = rm ? 1 : 0.13;
            ry += (ty - ry) * k;
            rh += (th - rh) * k;
            if (Math.abs(ty - ry) < 0.2) ry = ty;
            if (Math.abs(th - rh) < 0.2) rh = th;
            rg.style.transform = `translate3d(0,${ry.toFixed(1)}px,0)`;
            rg.style.height = rh.toFixed(1) + "px";
            rg.classList.add("rdy");
          }
          el.style.setProperty("--fp", Math.max(-1, Math.min(1, (r.top + r.height / 2) / vh - 0.5)).toFixed(3));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className={`sheet faq2${go ? " fgo" : ""}`} id="faq" aria-labelledby="fqh2" ref={sec}>
      <div className="fqbg" aria-hidden="true">
        <div className="fqbp">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/faqbg.jpg" alt="" />
        </div>
      </div>
      <div className="fqhead">
        <p className="fqeye qe">Question</p>
        <h2 className="qh" id="fqh2">
          <span className="qw">
            <i style={{ "--i": 0 } as CSSProperties}>Asked</i>
          </span>{" "}
          <span className="qw">
            <i style={{ "--i": 1 } as CSSProperties}>
              Often<b>.</b>
            </i>
          </span>
        </h2>
        <p className="fqlead qe" style={{ "--d": 1 } as CSSProperties}>
          Find quick answers to the questions we hear most from homeowners.
        </p>
      </div>
      <div className="fql">
        <span className="fqring" ref={ring} aria-hidden="true"></span>
        {FAQS.map((f, i) => {
          const open = i === cur;
          return (
            <div
              key={f.q}
              className={`fq${open ? " xo" : ""}`}
              style={{ "--i": i } as CSSProperties}
              ref={(el) => {
                items.current[i] = el;
              }}
            >
              <button
                type="button"
                className="fqh"
                id={`fqb${i}`}
                aria-expanded={open}
                aria-controls={`fqa${i}`}
                ref={(el) => {
                  heads.current[i] = el;
                }}
                onClick={() => set(open ? -1 : i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" && heads.current[i + 1]) {
                    e.preventDefault();
                    heads.current[i + 1]!.focus();
                  }
                  if (e.key === "ArrowUp" && heads.current[i - 1]) {
                    e.preventDefault();
                    heads.current[i - 1]!.focus();
                  }
                }}
              >
                <span className="fqi">
                  <Svg>{f.icon}</Svg>
                </span>
                <span className="fqd"></span>
                <span className="fqt">{f.q}</span>
                <span className="fqc">
                  <Svg>
                    <path d="M6 9.5l6 6 6-6" />
                  </Svg>
                </span>
              </button>
              <div className="fqa" id={`fqa${i}`} role="region" aria-labelledby={`fqb${i}`}>
                <div className="fqin">
                  <p>{f.a}</p>
                  {f.pics ? (
                    <div className="fqpics">
                      {PICS.map(([src, alt], k) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={src} src={src} alt={alt} style={{ "--k": k } as CSSProperties} loading="lazy" />
                      ))}
                    </div>
                  ) : (
                    <EnquireButton className="fqlink" source={`FAQ · ${f.q}`}>
                      Ask about this{" "}
                      <Svg>
                        <path d="M4 12h16M14 6l6 6-6 6" />
                      </Svg>
                    </EnquireButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="fqhelp qe" style={{ "--d": 2 } as CSSProperties}>
        Rather talk to a person?{" "}
        <EnquireButton source="FAQ help">Send an enquiry</EnquireButton> or <a href={`tel:${PHONE}`}>call us</a>.
      </p>
    </section>
  );
}
