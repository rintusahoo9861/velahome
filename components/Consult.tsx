"use client";

import { CSSProperties, Fragment, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/hooks";
import { ArrowRight } from "./icons";
import { EnquireButton } from "./SiteProvider";

const STAGES = [
  {
    title: "Walk the gallery",
    short: "See full-size interiors, glass and stone samples, and a built villa you can stand inside.",
    long: "Explore timber, glass and stone samples at your own pace and step inside the built villa. No pressure, no queue, and a guide only if you want one.",
    when: "Same week",
    cta: "Book a gallery visit",
    o: "40px",
    icon: (
      <>
        <circle cx="26" cy="9" r="3.6" />
        <path className="lg1" d="M22 40l4-12-5-5 2-9 7 4 5 3" />
        <path className="lg2" d="M26 28l7 5v8" />
        <path d="M23 14l-6 7 3 5" />
      </>
    ),
  },
  {
    title: "Shortlist and cost",
    short: "Narrow down 2–3 homes, share a timeline and get a transparent price.",
    long: "We narrow to two or three homes, share a line-by-line price and a build timeline, and introduce you to banks if you want a loan.",
    when: "3–5 days",
    cta: "Get a transparent price",
    o: "0px",
    icon: (
      <>
        <rect x="9" y="6" width="30" height="36" rx="4" />
        <rect x="14" y="11" width="20" height="7" rx="1.5" />
        <path className="kk" d="M16 25h.01M24 25h.01M32 25h.01M16 31h.01M24 31h.01M32 31h.01M16 37h.01M24 37h.01M32 37h.01" strokeWidth="3.2" />
      </>
    ),
  },
  {
    title: "Build and update",
    short: "Get photo updates on your home every two weeks, and a site visit whenever you like.",
    long: "A photo update lands on your phone every two weeks, and a site visit is always open to you. Questions go straight to your site engineer.",
    when: "Per project",
    cta: "Ask about site visits",
    o: "0px",
    icon: (
      <>
        <rect x="6" y="9" width="36" height="30" rx="4" />
        <circle cx="17" cy="19" r="3.2" />
        <path className="mt" d="M7 35l10-9 7 6 6-6 11 10" />
      </>
    ),
  },
  {
    title: "Handover",
    short: "Walk through with the site engineer, snag the final details, and take possession.",
    long: "A final walk-through with the site engineer, a snag list closed before you take possession, and the keys placed in your hand.",
    when: "On completion",
    cta: "Plan your handover",
    o: "34px",
    icon: (
      <>
        <circle cx="16" cy="32" r="8" />
        <path className="ky" d="M22 26l17-17M33 15l5 5M28 20l4 4" />
      </>
    ),
  },
];

const HOUSE_PATH =
  "M0.0000,0.0040 C0.0282,0.0206 0.0956,0.0699 0.1691,0.1038 C0.2426,0.1377 0.3615,0.1806 0.4412,0.2076 C0.5208,0.2345 0.5980,0.2485 0.6471,0.2655 C0.6961,0.2824 0.7096,0.2871 0.7353,0.3094 C0.7610,0.3317 0.7770,0.3560 0.8015,0.3992 C0.8260,0.4424 0.8578,0.5140 0.8824,0.5689 C0.9069,0.6238 0.9333,0.6770 0.9485,0.7285 C0.9637,0.7801 0.9728,0.8330 0.9735,0.8782 C0.9743,0.9235 0.9564,0.9797 0.9529,1.0000";
const HOUSE_PATH2 =
  "M0.0059,-0.0143 C0.0339,0.0022 0.1007,0.0511 0.1739,0.0849 C0.2470,0.1186 0.3653,0.1613 0.4447,0.1882 C0.5242,0.2151 0.6009,0.2287 0.6507,0.2461 C0.7004,0.2635 0.7161,0.2691 0.7432,0.2926 C0.7703,0.3160 0.7878,0.3427 0.8131,0.3870 C0.8384,0.4314 0.8701,0.5028 0.8949,0.5585 C0.9198,0.6142 0.9466,0.6679 0.9622,0.7211 C0.9777,0.7743 0.9874,0.8306 0.9882,0.8778 C0.9891,0.9250 0.9708,0.9834 0.9673,1.0045";

/** scroll progress at which each stage becomes current */
const F = [0, 0.5, 0.75, 1];
const clamp = (a: number, b: number, c: number) => Math.min(c, Math.max(b, a));

/** Opening hours of the sales gallery, minutes after midnight IST. */
const HOURS: Record<string, [number, number]> = {
  Mon: [600, 1140], Tue: [600, 1140], Wed: [600, 1140], Thu: [600, 1140], Fri: [600, 1140], Sat: [600, 1140], Sun: [660, 960],
};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function openStatus(): { open: boolean; text: string } {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
  const g = (t: string) => p.find((x) => x.type === t)!.value;
  const wd = g("weekday");
  const mins = (+g("hour") % 24) * 60 + +g("minute");
  const t = (m: number) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return (h % 12 || 12) + (mm ? ":" + String(mm).padStart(2, "0") : "") + (h < 12 ? " am" : " pm");
  };
  const [o, c] = HOURS[wd];
  if (mins >= o && mins < c) return { open: true, text: `Sales gallery open now · until ${t(c)} · Kokapet` };
  let nxt = wd;
  let add = 0;
  if (mins >= o) {
    nxt = DAYS[(DAYS.indexOf(wd) + 1) % 7];
    add = 1;
  }
  return { open: false, text: `Gallery closed · opens ${add ? nxt + " " : ""}${t(HOURS[nxt][0])} IST` };
}

export default function Consult() {
  const sec = useRef<HTMLElement>(null);
  const jr = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const pb = useRef<SVGPathElement>(null);
  const pd = useRef<SVGPathElement>(null);
  const pm = useRef<SVGPathElement>(null);

  const [go, setGo] = useState(false);
  const [rdy, setRdy] = useState(false);
  const [act, setAct] = useState(0);
  const [openI, setOpenI] = useState(-1);
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);

  /* shared with the animation loop */
  const st = useRef({ act: 0, manual: false, v: 0, tv: 0, L: 1, sig: "" });

  useEffect(() => setStatus(openStatus()), []);

  function pick(i: number) {
    st.current.manual = true;
    st.current.act = i;
    setAct(i);
    setOpenI((o) => (o === i ? -1 : i));
    st.current.tv = Math.max(st.current.tv, F[i]);
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* the dotted path through the stage nodes, drawn as you scroll */
  useEffect(() => {
    const s = st.current;
    const rm = prefersReducedMotion();
    const ox = 170;
    let raf = 0;

    const layout = () => {
      const box = jr.current;
      if (!box || !pm.current) return;
      const k = clamp(box.offsetWidth / 760, 0.7, 1.1);
      const gap = [60, 86, 86, 72];
      const pts = cards.current.map((c, i) => {
        const r = c!.querySelector<HTMLElement>(".jrow")!;
        return [c!.offsetLeft - gap[i] * k, c!.offsetTop + r.offsetHeight / 2];
      });
      const sig = pts.map((p) => p.map(Math.round)).join("|");
      if (sig === s.sig) return;
      s.sig = sig;
      pts.forEach((p, i) => {
        const n = nodes.current[i];
        if (n) {
          n.style.left = p[0] + "px";
          n.style.top = p[1] + "px";
        }
      });
      const q = pts.map((p) => [p[0] + ox, p[1]]);
      let d = `M${q[0][0]} ${q[0][1]}`;
      for (let i = 0; i < 3; i++) {
        const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(3, i + 2)];
        d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6},${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6},${p2[0]} ${p2[1]}`;
      }
      pb.current!.setAttribute("d", d);
      pd.current!.setAttribute("d", d);
      pm.current.setAttribute("d", d);
      s.L = pm.current.getTotalLength() || 1;
      pm.current.style.strokeDasharray = String(s.L);
      setRdy(true);
    };

    const draw = () => {
      let f = 0;
      for (let i = 0; i < 3; i++) if (s.v >= F[i]) f = (i + clamp((s.v - F[i]) / (F[i + 1] - F[i]), 0, 1)) / 3;
      if (pm.current) pm.current.style.strokeDashoffset = String(s.L * (1 - f));
    };

    const tick = () => {
      layout();
      const el = sec.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom > -100 && r.top < vh + 100) {
          const p = clamp((vh * 0.6 - r.top) / (vh * 0.6 + r.height * 0.8), 0, 1);
          if (!s.manual) {
            s.tv = p;
            let a = 0;
            F.forEach((f, i) => {
              if (p >= f - 0.001) a = i;
            });
            if (a !== s.act) {
              s.act = a;
              setAct(a);
            }
          } else s.tv = Math.max(s.tv, F[s.act]);
          s.v += (s.tv - s.v) * (rm ? 1 : 0.075);
          if (Math.abs(s.tv - s.v) < 0.0005) s.v = s.tv;
          draw();
          el.style.setProperty("--bp", clamp((r.top + r.height / 2) / vh - 0.5, -1, 1).toFixed(3));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const onResize = () => (s.sig = "");
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const words: [string, boolean?][] = [["From"], ["first"], ["visit"]];

  return (
    <section className={`sheet consult2${go ? " cgo" : ""}`} id="consult" aria-labelledby="c2h" ref={sec}>
      <div className="cblob" aria-hidden="true"></div>
      <div className="chead">
        <p className="eyebrow ce">Consult</p>
        <h2 className="c2h" id="c2h">
          <span className="cl">
            {words.map(([w], i) => (
              <Fragment key={w}>
                <span className="cw">
                  <i style={{ "--i": i } as CSSProperties}>{w}</i>
                </span>{" "}
              </Fragment>
            ))}
          </span>
          <span className="cl">
            <span className="cw">
              <i style={{ "--i": 3 } as CSSProperties}>to</i>
            </span>{" "}
            <span className="cw yk">
              <i style={{ "--i": 4 } as CSSProperties}>your keys.</i>
              <svg viewBox="0 0 330 26" preserveAspectRatio="none" aria-hidden="true">
                <path pathLength={1} d="M4 20C70 6 150 4 210 9s90 4 116-3" />
              </svg>
            </span>
          </span>
        </h2>
        <p className="clead ce" style={{ "--d": 1 } as CSSProperties}>
          A personalised, end-to-end journey with experts by your side.
        </p>
        <EnquireButton className="ccta ce" style={{ "--d": 2 } as CSSProperties} source="Start your consultation">
          <span>Start Your Consultation</span>
          <i>
            <ArrowRight />
          </i>
        </EnquireButton>
      </div>
      <div className="chouse" aria-hidden="true">
        <div className="chp">
          <svg className="hsvg" width="0" height="0" aria-hidden="true" focusable="false">
            <defs>
              <clipPath id="hclip" clipPathUnits="objectBoundingBox">
                <path d={HOUSE_PATH + " L0,1 Z"} />
              </clipPath>
            </defs>
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/house2.jpg" alt="" loading="lazy" />
        </div>
        <svg className="hline" viewBox="0 0 1 1" preserveAspectRatio="none">
          <path d={HOUSE_PATH} />
          <path className="h2l" d={HOUSE_PATH2} />
        </svg>
      </div>
      <div className={`jr${rdy ? " rdy" : ""}`} ref={jr}>
        <svg className="jtl" aria-hidden="true">
          <defs>
            <mask id="jm" maskUnits="userSpaceOnUse" x="-400" y="-200" width="3000" height="4000">
              <path ref={pm} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
            </mask>
          </defs>
          <path ref={pb} className="jb" />
          <path ref={pd} className="jd" mask="url(#jm)" />
        </svg>
        {STAGES.map((s, i) => (
          <button
            key={s.title}
            className={`jnode${i === act ? " cur" : ""}${i < act ? " dn" : ""}`}
            aria-label={`Go to stage 0${i + 1}: ${s.title}`}
            ref={(el) => {
              nodes.current[i] = el;
            }}
            onClick={() => pick(i)}
          >
            0{i + 1}
          </button>
        ))}
        <div className="jl" role="list">
          {STAGES.map((s, i) => (
            <article
              key={s.title}
              className={`jcard${i === act ? " ac" : ""}${i === openI ? " xo" : ""}`}
              style={{ "--i": i, "--o": s.o } as CSSProperties}
              tabIndex={0}
              role="button"
              aria-expanded={i === openI}
              aria-label={`Stage 0${i + 1}: ${s.title}`}
              ref={(el) => {
                cards.current[i] = el;
              }}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest(".jlink")) return;
                pick(i);
              }}
              onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick(i);
                }
                if (e.key === "ArrowDown" && cards.current[i + 1]) {
                  e.preventDefault();
                  cards.current[i + 1]!.focus();
                }
                if (e.key === "ArrowUp" && cards.current[i - 1]) {
                  e.preventDefault();
                  cards.current[i - 1]!.focus();
                }
              }}
            >
              <div className="jin">
                <div className="jrow">
                  <span className="jno">0{i + 1}</span>
                  <span className="jic">
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {s.icon}
                    </svg>
                  </span>
                  <span className="jdv"></span>
                  <span className="jtx">
                    <h3>{s.title}</h3>
                    <p>{s.short}</p>
                  </span>
                  <span className="jar" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </div>
                <div className="jmore">
                  <div>
                    <p>{s.long}</p>
                    <div className="jfoot">
                      <span className="jw">{s.when}</span>
                      <EnquireButton className="jlink" source={`Consult · 0${i + 1} ${s.title}`}>
                        {s.cta} <ArrowRight />
                      </EnquireButton>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <p className={`open ce${status && !status.open ? " closed" : ""}`} style={{ "--d": 3 } as CSSProperties}>
        <i></i>
        <span>{status ? status.text : "Sales gallery · Kokapet, Hyderabad"}</span>
      </p>
    </section>
  );
}
