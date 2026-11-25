"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HOMES, HomeType } from "@/lib/homes";
import { ArrowUpRight, AreaIcon, BedIcon, CalIcon, PinIcon, TypeIcon } from "./icons";
import { Reveal, SplitHeading } from "./Reveal";
import { EnquireButton } from "./SiteProvider";

type Filter = "all" | HomeType;

const TABS: { f: Filter; label: string }[] = [
  { f: "all", label: "All" },
  { f: "Villa", label: "Villas" },
  { f: "Cottage", label: "Cottages" },
  { f: "Townhouse", label: "Townhouses" },
];

const fmtCr = (cr: number) => `₹${cr} Cr`;

export default function Catalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const [act, setAct] = useState(0);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const prevO = useRef(new Map<number, number>());
  const pointerX = useRef<number | null>(null);

  const list = HOMES.map((_, i) => i).filter((i) => filter === "all" || HOMES[i].typ === filter);
  const n = list.length;
  const go = useCallback((i: number) => setAct(((i % n) + n) % n), [n]);

  /* position every card in 3D around the active one */
  const layout = useCallback(() => {
    const st = stage.current;
    if (!st) return;
    const W = st.parentElement!.clientWidth;
    const mob = W < 760;
    const cw = mob ? Math.min(W * 0.8, 440) : Math.min(W * 0.46, 720);
    st.style.setProperty("--cw", cw + "px");
    cards.current.forEach((c, idx) => {
      if (!c) return;
      const k = list.indexOf(idx);
      if (k < 0) {
        c.classList.remove("on");
        c.classList.add("off");
        c.inert = true;
        c.style.setProperty("--op", "0");
        return;
      }
      let o = k - act;
      if (o > n / 2) o -= n;
      if (o < -n / 2) o += n;
      const a = Math.abs(o);
      const vis = a <= (mob ? 1 : 2);
      const sg = Math.sign(o);
      const prev = prevO.current.get(idx);
      /* a card wrapping round the back jumps instead of flying across */
      if (prev !== undefined && Math.abs(prev) >= 2 && a >= 2 && Math.sign(prev) !== sg) {
        c.style.transition = "none";
        requestAnimationFrame(() => requestAnimationFrame(() => (c.style.transition = "")));
      }
      prevO.current.set(idx, o);
      const xo = a === 0 ? 0 : a === 1 ? (mob ? 0.76 : 0.63) : 0.94;
      c.style.setProperty("--x", (sg * xo * cw).toFixed(1) + "px");
      c.style.setProperty("--y", (a === 0 ? 0 : a === 1 ? 42 : 74) + "px");
      c.style.setProperty("--z", (a === 0 ? 0 : a === 1 ? -170 : -340) + "px");
      c.style.setProperty("--r", -sg * (a === 0 ? 0 : a === 1 ? (mob ? 18 : 26) : 32) + "deg");
      c.style.setProperty("--zi", String(10 - a));
      c.style.setProperty("--op", String(vis ? (a === 2 ? 0.85 : 1) : 0));
      c.classList.toggle("off", !vis);
      const on = o === 0;
      c.classList.toggle("on", on);
      c.inert = !vis;
      c.querySelectorAll<HTMLElement>(".r2 button,.r2 a").forEach((x) => (x.tabIndex = on ? 0 : -1));
      if (on) c.removeAttribute("aria-hidden");
      else c.setAttribute("aria-hidden", "true");
    });
    const r2 = cards.current[0]?.querySelector<HTMLElement>(".r2");
    if (r2) st.style.setProperty("--cut", r2.offsetHeight + "px");
    const h = Math.max(...cards.current.map((c) => c?.offsetHeight ?? 0));
    st.style.setProperty("--ch", h + (mob ? 36 : 44) + "px");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, act, n]);

  useLayoutEffect(() => {
    setReady(true);
  }, []);
  useLayoutEffect(() => {
    if (ready) layout();
  }, [ready, layout]);
  useEffect(() => {
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [layout]);

  /* play the active card's entrance once the carousel is in view */
  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    const io = new IntersectionObserver(
      (es, ob) => {
        if (es.some((e) => e.isIntersecting)) {
          setLive(true);
          ob.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(st);
    const t = window.setTimeout(() => {
      if (st.getBoundingClientRect().top < window.innerHeight * 0.7) setLive(true);
    }, 1600);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  function pickFilter(f: Filter) {
    prevO.current.clear();
    setFilter(f);
    setAct(0);
  }

  const cur = HOMES[list[act]];

  return (
    <section className="sheet sec cfsec" id="catalog">
      <div className="head cfhead">
        <Reveal>
          <p className="eyebrow">Catalog</p>
          <SplitHeading lines={[[["Six homes,"]], [["one", true], [" standard."]]]} />
        </Reveal>
        <Reveal className="cfr" d={2}>
          <p className="lead">Teak, glass and board-marked concrete, built by our own crews. Every price below is the full ₹ price before registration.</p>
          <div className="tabs" role="tablist" aria-label="Home type">
            {TABS.map(({ f, label }) => (
              <button key={f} className="tab" role="tab" aria-selected={filter === f} onClick={() => pickFilter(f)}>
                {f !== "all" && <TypeIcon type={f} />}
                {label} <small>{f === "all" ? HOMES.length : HOMES.filter((h) => h.typ === f).length}</small>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
      <Reveal className="cfwrap" d={1}>
        <div
          className={`cf-stage${ready ? " ready" : ""}${live ? " live" : ""}`}
          ref={stage}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Homes catalog. Use the arrow keys to change home."
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(act + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(act - 1);
            }
          }}
          onPointerDown={(e) => (pointerX.current = e.clientX)}
          onPointerUp={(e) => {
            if (pointerX.current === null) return;
            const d = e.clientX - pointerX.current;
            pointerX.current = null;
            if (Math.abs(d) > 50) go(act + (d < 0 ? 1 : -1));
          }}
        >
          {HOMES.map((h, idx) => (
            <article
              key={h.name}
              className="cf"
              data-type={h.typ}
              aria-label={h.name}
              ref={(el) => {
                cards.current[idx] = el;
              }}
              onClick={(e) => {
                const c = e.currentTarget;
                if (c.classList.contains("on")) return;
                const k = list.indexOf(idx);
                if (k >= 0) go(k);
              }}
            >
              <div className="cfi">
                <div className="cfp">
                  <span className="cft">
                    <TypeIcon type={h.typ} />
                    {h.typ}
                  </span>
                  <div className="pin">
                    <div className="gb" style={{ backgroundImage: "url(/back.jpg)", backgroundPosition: h.bgPos }}></div>
                    <div className="hw">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="hm"
                        src="/house.webp"
                        alt={`${h.name}, ${h.typ.toLowerCase()} in ${h.loc}`}
                        loading="lazy"
                        style={{ "--w": h.w, "--f": h.f } as React.CSSProperties}
                      />
                    </div>
                    {h.tint && <div className="tint" style={{ background: h.tint }}></div>}
                  </div>
                </div>
                <div className="cfd">
                  <div className="r1">
                    <div className="nm">
                      <h3>{h.name}</h3>
                      <p className="where">
                        <PinIcon />
                        {h.loc}, Hyderabad
                      </p>
                    </div>
                    <div className="pr">
                      <small>Full price</small>
                      {fmtCr(h.cr)}
                    </div>
                  </div>
                  <div className="r2">
                    <ul className="sp">
                      <li>
                        <BedIcon />
                        {h.bhk} BHK
                      </li>
                      <li>
                        <AreaIcon />
                        {h.sf.toLocaleString("en-IN")} sq ft
                      </li>
                      <li>
                        <CalIcon />
                        Handover {h.handover}
                      </li>
                    </ul>
                    <EnquireButton className="btn" source="Catalog" home={h.name}>
                      Enquire{" "}
                      <i>
                        <ArrowUpRight />
                      </i>
                    </EnquireButton>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="cfc">
          <button className="cfa" aria-label="Previous home" onClick={() => go(act - 1)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8H3M7 4 3 8l4 4" />
            </svg>
          </button>
          <div className="cfdots" role="tablist" aria-label="Choose a home">
            {list.map((idx, i) => (
              <button key={idx} type="button" role="tab" aria-label={`Show ${HOMES[idx].name}`} aria-selected={i === act} onClick={() => go(i)} />
            ))}
          </div>
          <button className="cfa dk" aria-label="Next home" onClick={() => go(act + 1)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        </div>
        <p className="sr" aria-live="polite">
          {cur ? `${cur.name}, ${act + 1} of ${n}` : ""}
        </p>
      </Reveal>
    </section>
  );
}
