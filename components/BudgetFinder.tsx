"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { emiLakh, HOMES, homesThatFit } from "@/lib/homes";
import { prefersReducedMotion } from "@/lib/hooks";
import { ArrowUpRight, HouseChipIcon } from "./icons";
import { Reveal, SplitHeading } from "./Reveal";
import { useSite } from "./SiteProvider";

const BHK = [
  { b: 0, label: "Any" },
  { b: 2, label: "2" },
  { b: 3, label: "3" },
  { b: 4, label: "4" },
  { b: 5, label: "5+" },
];
const fmtB = (v: number) => "₹" + v.toFixed(1);

export default function BudgetFinder() {
  const { openEnquiry } = useSite();
  const [budget, setBudget] = useState(4);
  const [bhk, setBhk] = useState(0);
  const [front, setFront] = useState(-1);
  const [step, setStep] = useState<"bud" | "bhk" | "match">("bud");
  const [live, setLive] = useState(false);

  const sec = useRef<HTMLElement>(null);
  const bigv = useRef<HTMLSpanElement>(null);
  const shown = useRef(4);
  const tween = useRef(0);
  const rangeRef = useRef<HTMLInputElement>(null);
  const bhkRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const pvRef = useRef<HTMLElement>(null);

  const fit = homesThatFit(budget, bhk);
  const fitIdx = fit.map((h) => h.i);
  const listKey = fitIdx.join();
  /* the front card stays put while it still fits, otherwise the first match takes over */
  const frontNow = fitIdx.includes(front) ? front : fitIdx.length ? fitIdx[0] : -1;
  useEffect(() => {
    if (frontNow !== front) setFront(frontNow);
  }, [frontNow, front]);

  /* the big number counts to the new budget */
  useEffect(() => {
    const el = bigv.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      shown.current = budget;
      el.textContent = fmtB(budget);
      return;
    }
    cancelAnimationFrame(tween.current);
    const from = shown.current;
    const t0 = performance.now();
    const d = 420;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / d);
      const e = 1 - Math.pow(1 - k, 3);
      shown.current = from + (budget - from) * e;
      el.textContent = fmtB(shown.current);
      if (k < 1) tween.current = requestAnimationFrame(tick);
      else {
        shown.current = budget;
        el.textContent = fmtB(budget);
      }
    };
    tween.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(tween.current);
  }, [budget]);

  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es, ob) => {
        if (es.some((e) => e.isIntersecting)) {
          setLive(true);
          ob.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* keep a gap between the preview stack and the home chips on wide screens */
  useEffect(() => {
    const pv = pvRef.current;
    const rn = namesRef.current;
    if (!pv || !rn) return;
    const lift = () => {
      pv.style.top = "";
      if (window.innerWidth <= 1100) return;
      const r = pv.getBoundingClientRect();
      const base = parseFloat(getComputedStyle(pv).top) || 0;
      const mb = r.bottom + 14;
      let d = 0;
      rn.querySelectorAll(".fchip").forEach((c) => {
        const b = c.getBoundingClientRect();
        if (b.right > r.left - 6 && b.top < mb + 5 && b.bottom > r.top) d = Math.min(d, b.top - 5 - mb);
      });
      if (d < 0) pv.style.top = base + d + "px";
    };
    const ro = new ResizeObserver(() => requestAnimationFrame(lift));
    ro.observe(rn);
    window.addEventListener("resize", lift);
    const t1 = window.setTimeout(lift, 400);
    const t2 = window.setTimeout(lift, 1800);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", lift);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  function focusStep(s: typeof step) {
    setStep(s);
    const el =
      s === "bud"
        ? rangeRef.current
        : s === "bhk"
          ? bhkRef.current?.querySelector<HTMLElement>('.chip2[aria-pressed="true"]')
          : namesRef.current?.querySelector<HTMLElement>(".fchip") ?? goRef.current;
    el?.focus({ preventScroll: true });
  }

  /* preview stack: front card, then up to three behind it */
  const order = fitIdx.length ? [frontNow, ...fitIdx.filter((i) => i !== frontNow)] : [];
  const cardStyle = (i: number): CSSProperties => {
    const p = order.indexOf(i);
    if (p < 0) return { "--o": 0, "--x": "150px", "--s": ".7", "--zi": 0 } as CSSProperties;
    const q = Math.min(p, 3);
    return {
      "--x": (p === 0 ? 0 : q * 34 + 30) + "px",
      "--y": (p === 0 ? 0 : -q * 6) + "px",
      "--z": -q * 70 + "px",
      "--s": (1 - q * 0.08).toFixed(2),
      "--o": p > 3 ? 0 : (1 - q * 0.22).toFixed(2),
      "--zi": 10 - p,
    } as CSSProperties;
  };

  const fh = frontNow >= 0 ? HOMES[frontNow] : null;
  const emi = `Instalment on a ₹${budget.toFixed(1)} Cr home: about ₹${emiLakh(budget)} lakh a month`;

  function explore() {
    const note =
      `Budget ₹${budget} Cr` + (bhk ? `, ${bhk === 5 ? "5+" : bhk} BHK` : "") + (fit.length ? `. Homes that fit: ${fit.map((h) => h.name).join(", ")}` : "");
    openEnquiry("Budget finder", null, note);
  }

  return (
    <section className={`sheet finder2${live ? " live" : ""}`} id="finder" ref={sec}>
      <div className="fl">
        <Reveal>
          <p className="eyebrow">Budget planner</p>
          <SplitHeading lines={[[["What does your"]], [["budget", true], [" buy?"]]]} />
        </Reveal>
        <Reveal as="p" className="lead" d={1}>
          Slide to your comfort. Explore the homes that fit your budget, lifestyle and space needs.
        </Reveal>
      </div>
      <div className="fphoto" aria-hidden="true">
        <div className="fpz">
          <div className="fph">
            <div className="fbg"></div>
          </div>
        </div>
      </div>
      <div className="fpanel">
        <Reveal className="fsteps" d={3}>
          <svg viewBox="0 0 272 92" fill="none" aria-hidden="true">
            <path d="M26 26C66 56 98 70 133 62S212 40 246 48" stroke="#dfe5e9" strokeWidth="1.5" />
          </svg>
          <button className={`fstep${step === "bud" ? " on" : ""}`} data-s="bud" aria-label="Budget" onClick={() => focusStep("bud")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5M10 20v-6h4v6" />
            </svg>
          </button>
          <button className={`fstep${step === "bhk" ? " on" : ""}`} data-s="bhk" aria-label="Bedrooms" onClick={() => focusStep("bhk")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2.5" />
              <path d="M12 4v16M4 12h16" />
            </svg>
          </button>
          <button className={`fstep${step === "match" ? " on" : ""}`} data-s="match" aria-label="Matching homes" onClick={() => focusStep("match")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3ZM5 17v2M19 17v2" />
            </svg>
          </button>
        </Reveal>
        <Reveal className="fpr" d={3}>
          <span className="bigv2" ref={bigv}>
            ₹4.0
          </span>
          <span className="cr">Cr budget</span>
        </Reveal>
        <Reveal d={4}>
          <input
            ref={rangeRef}
            type="range"
            min="1"
            max="8"
            step=".1"
            value={budget}
            aria-label="Budget in crore rupees"
            style={{ "--p": ((budget - 1) / 7) * 100 + "%" } as CSSProperties}
            onChange={(e) => setBudget(+e.target.value)}
          />
        </Reveal>
        <Reveal className="fbh" d={5}>
          <p className="flab" id="bhlab">
            Bedrooms
          </p>
          <div className="chips2" role="group" aria-labelledby="bhlab" ref={bhkRef}>
            {BHK.map(({ b, label }) => (
              <button key={b} className="chip2" aria-pressed={bhk === b} onClick={() => setBhk(b)}>
                {label}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal className="fmt" d={6}>
          <p className="flab">Matching homes</p>
          <p className="fcount swap" aria-live="polite">
            <span key={listKey}>{fit.length ? `${fit.length} home${fit.length > 1 ? "s" : ""} fit` : "Nothing fits yet"}</span>
          </p>
        </Reveal>
        <Reveal className="fpv" d={6} innerRef={pvRef}>
            {HOMES.map((h, i) => {
            const p = order.indexOf(i);
            return (
              <article
                key={h.name}
                className={`pvc${p < 0 ? " hid" : ""}${p === 0 ? " front" : ""}`}
                aria-label={h.name}
                style={{ "--gp": h.bgPos, "--f": h.f, ...cardStyle(i) } as CSSProperties}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest(".go")) return;
                  if (p > 0) setFront(i);
                }}
              >
                <div className="pvi">
                  <div className="pbg"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/house.webp" alt="" loading="lazy" style={{ "--hw": h.hw } as CSSProperties} />
                </div>
                {h.tint && <div className="tint" style={{ position: "absolute", inset: 0, background: h.tint }}></div>}
                <button className="go" aria-label={`Enquire about ${h.name}`} onClick={() => openEnquiry("Budget finder", h.name)}>
                  <ArrowUpRight />
                </button>
              </article>
            );
            })}
        </Reveal>
        <Reveal className="fnames" d={7} innerRef={namesRef}>
          <>
            {fit.length ? (
              fit.map((h, k) => (
                <button key={`${listKey}-${h.i}`} className={`fchip${h.i === frontNow ? " on" : ""}`} style={{ "--i": k } as CSSProperties} onClick={() => setFront(h.i)}>
                  <HouseChipIcon />
                  {h.name} · ₹{h.cr} Cr
                </button>
              ))
            ) : (
              <span className="fchip" key={`none-${listKey}`} style={{ "--i": 0 } as CSSProperties}>
                Try a higher budget or any bedroom count
              </span>
            )}
          </>
        </Reveal>
        <Reveal as="p" className="fnote" d={7}>
          {fit.length && fh ? (
            <>
              <b>{fh.name}</b> · {fh.loc} · {fh.bhk} BHK · {fh.sf.toLocaleString("en-IN")} sq ft<small>{emi}</small>
            </>
          ) : (
            <small>{emi}</small>
          )}
        </Reveal>
        <Reveal d={8}>
          <button className="fcta" ref={goRef} onClick={explore}>
            Explore Matching Homes{" "}
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </i>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
