"use client";

import { CSSProperties, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { MAPS_URL, PHONE, PHONE_LABEL, WA_GALLERY } from "@/lib/homes";
import { prefersReducedMotion } from "@/lib/hooks";
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from "./icons";
import { EnquireButton } from "./SiteProvider";

type Link = { label: string; href?: string; external?: boolean; open?: string };

const COLS: { title: string; k: number; links: Link[] }[] = [
  {
    title: "Explore",
    k: 6,
    links: [
      { label: "Homes", href: "#catalog" },
      { label: "Gallery", href: "#main" },
      { label: "Amenities", open: "Footer · Amenities" },
      { label: "Location", href: MAPS_URL, external: true },
    ],
  },
  {
    title: "Home Buying",
    k: 7,
    links: [
      { label: "How it works", href: "#consult" },
      { label: "Pricing", href: "#finder" },
      { label: "Site visit", open: "Footer · Site visit" },
      { label: "FAQs", href: "#faq" },
    ],
  },
  {
    title: "About",
    k: 8,
    links: [
      { label: "Our story", href: "#main" },
      { label: "Team", open: "Footer · Team" },
      { label: "Contact", open: "Footer · Contact" },
    ],
  },
];

const k = (n: number) => ({ "--k": n }) as CSSProperties;

/** A footer column whose glowing dot follows the hovered or focused link. */
function NavCol({ title, k: kk, links }: { title: string; k: number; links: Link[] }) {
  const ul = useRef<HTMLUListElement>(null);
  const dot = useRef<HTMLLIElement>(null);
  const [on, setOn] = useState(false);
  const to = (li: HTMLLIElement) => {
    const d = dot.current;
    if (!d) return;
    const h = (li.firstElementChild as HTMLElement).offsetHeight;
    d.style.transform = `translateY(${li.offsetTop + h / 2 - d.offsetHeight / 2}px)`;
    setOn(true);
  };
  return (
    <nav className="fc rv" style={k(kk)} aria-label={title}>
      <h3>{title}</h3>
      <ul
        ref={ul}
        onPointerLeave={() => setOn(false)}
        onBlur={(e) => {
          if (!ul.current?.contains(e.relatedTarget as Node)) setOn(false);
        }}
      >
        {links.map((l, i) => (
          <li
            key={l.label}
            style={{ "--j": i + (kk - 6) * 0.5 } as CSSProperties}
            onPointerEnter={(e) => to(e.currentTarget)}
            onFocus={(e) => to(e.currentTarget)}
          >
            {l.open ? (
              <EnquireButton className="fa" source={l.open}>
                {l.label}
              </EnquireButton>
            ) : (
              <a className="fa" href={l.href} {...(l.external ? { target: "_blank", rel: "noopener" } : {})}>
                {l.label}
              </a>
            )}
          </li>
        ))}
        <li className={`fdot${on ? " on" : ""}`} ref={dot} aria-hidden="true"></li>
      </ul>
    </nav>
  );
}

function Newsletter() {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "bad">("idle");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "ok" || state === "busy") return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email.trim())) {
      /* restart the shake */
      setState("idle");
      requestAnimationFrame(() => setState("bad"));
      setMsg("Please enter a valid email address.");
      input.current?.focus();
      return;
    }
    setMsg("");
    setState("busy");
    timers.current.push(
      window.setTimeout(
        () => {
          setState("ok");
          setEmail("");
          setMsg("Subscribed. (Demo form: nothing is stored.)");
          timers.current.push(
            window.setTimeout(() => {
              setState("idle");
              setMsg("");
            }, 7000)
          );
        },
        prefersReducedMotion() ? 0 : 750
      )
    );
  }

  return (
    <div className="fc fnl-c rv" style={k(9)}>
      <h3>Stay in the loop</h3>
      <p>Get updates on new launches, site progress and exclusive offers.</p>
      <form className={`fnl${state !== "idle" ? " " + state : ""}`} noValidate onSubmit={submit}>
        <svg className="fmail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4 7 8 6 8-6" />
        </svg>
        <input
          ref={input}
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          aria-label="Email address"
          aria-describedby="fnmsg"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "bad") {
              setState("idle");
              setMsg("");
            }
          }}
        />
        <span className="fnok" aria-hidden="true">
          You&apos;re on the list
        </span>
        <button className="fnb" type="submit" aria-label="Subscribe">
          <svg className="fna" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 10h13M11 5l5 5-5 5" />
          </svg>
          <svg className="fck" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m4.5 10.5 3.6 3.6 7.4-8" />
          </svg>
        </button>
      </form>
      <p className="fnmsg" id="fnmsg" role="status" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}

const Ft = ({ href, label, icon, title, sub, className = "ft" }: { href: string; label: string; icon: ReactNode; title: string; sub: string; className?: string }) => (
  <a className={className} href={href} target="_blank" rel="noopener" aria-label={label}>
    {icon}
    <span>
      <b>{title}</b>
      {sub}
    </span>
  </a>
);

export default function Footer() {
  const foot = useRef<HTMLElement>(null);
  const bw = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  const goRef = useRef(false);
  goRef.current = go;

  /* plays when 14% is in view, resets when it leaves, so it replays next time */
  useEffect(() => {
    const f = foot.current;
    if (!f) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.intersectionRatio >= 0.14) setGo(true);
          else if (e.intersectionRatio < 0.04) setGo(false);
        }),
      { threshold: [0, 0.04, 0.14] }
    );
    io.observe(f);
    return () => io.disconnect();
  }, []);

  /* magnetic "Book a visit" */
  useEffect(() => {
    const wrap = bw.current;
    const bk = wrap?.querySelector<HTMLElement>(".fbook");
    const ar = bk?.querySelector<HTMLElement>("i");
    if (!wrap || !bk || !ar) return;
    if (prefersReducedMotion() || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.17;
      cy += (ty - cy) * 0.17;
      bk.style.translate = `${cx.toFixed(2)}px ${cy.toFixed(2)}px`;
      ar.style.translate = `${(cx * 0.45).toFixed(2)}px ${(cy * 0.45).toFixed(2)}px`;
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.04 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      if (!goRef.current) return;
      const r = wrap.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const R = Math.max(r.width, r.height) * 0.78;
      if (Math.hypot(dx, dy) < R) {
        tx = Math.max(-12, Math.min(12, dx * 0.3));
        ty = Math.max(-8, Math.min(8, dy * 0.36));
      } else tx = ty = 0;
      kick();
    };
    const leave = () => {
      tx = ty = 0;
      kick();
    };
    window.addEventListener("pointermove", move, { passive: true });
    wrap.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
    };
  }, []);

  const D1 = "M925 0C842 70 772 168 749 290C735 352 718 402 688 432C648 480 600 520 560 543";
  const D2 = "M560 772C700 716 850 683 985 681C1150 679 1330 722 1425 772";

  return (
    <footer className={`sheet foot${go ? " fgo" : ""}`} id="contact" aria-label="VelaHome footer" ref={foot}>
      <svg className="fcv" viewBox="0 0 2036 772" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="fg1" gradientUnits="userSpaceOnUse" x1="925" y1="0" x2="560" y2="545">
            <stop offset="0" stopColor="#f2a36b" stopOpacity="0" />
            <stop offset=".38" stopColor="#f2a36b" stopOpacity=".22" />
            <stop offset=".72" stopColor="#ffc592" stopOpacity="1" />
            <stop offset="1" stopColor="#f2a36b" stopOpacity=".25" />
          </linearGradient>
          <linearGradient id="fg2" gradientUnits="userSpaceOnUse" x1="560" y1="0" x2="1430" y2="0">
            <stop offset="0" stopColor="#f2a36b" stopOpacity="0" />
            <stop offset=".3" stopColor="#ffc592" stopOpacity="1" />
            <stop offset=".55" stopColor="#f2a36b" stopOpacity=".35" />
            <stop offset="1" stopColor="#f2a36b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="none" strokeLinecap="round">
          <path className="d g" pathLength={1} d={D1} stroke="url(#fg1)" strokeWidth="9" opacity=".16" />
          <path className="d" pathLength={1} d={D1} stroke="url(#fg1)" strokeWidth="2.4" />
          <path className="d g" pathLength={1} d={D2} stroke="url(#fg2)" strokeWidth="9" opacity=".16" />
          <path className="d" pathLength={1} d={D2} stroke="url(#fg2)" strokeWidth="2.4" />
          <path className="t t1" pathLength={1} d={D1} stroke="#fff1e0" strokeWidth="3.2" />
          <path className="t t1 tg" pathLength={1} d={D1} stroke="#ffb878" strokeWidth="12" />
          <path className="t t2" pathLength={1} d={D2} stroke="#fff1e0" strokeWidth="3.2" />
          <path className="t t2 tg" pathLength={1} d={D2} stroke="#ffb878" strokeWidth="12" />
        </g>
      </svg>
      <div className="fgrid">
        <div className="fl">
          <a className="flogo rv" style={k(0)} href="#main" aria-label="VelaHome, back to top">
            <svg viewBox="0 0 44 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M3 18 22 3l19 15v19H3z" />
              <path d="M16 37V25h12v12" />
            </svg>
            <span>VelaHome</span>
          </a>
          <h2 className="fh">
            <span className="ln">
              <i className="rv" style={k(1)}>
                Find the home
              </i>
            </span>
            <span className="ln">
              <i className="rv" style={k(2)}>
                that <em>fits</em> your family.
              </i>
            </span>
          </h2>
          <p className="fp rv" style={k(3)}>
            Thoughtfully designed homes in the right locations, <br />
            with the space, comfort and value your family deserves.
          </p>
        </div>
        <div className="fhouse" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fhouse.jpg" alt="" width="730" height="356" loading="lazy" />
          <svg className="fct" viewBox="0 0 652 318" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="fcg" gradientUnits="userSpaceOnUse" x1="60" y1="300" x2="640" y2="40">
                <stop offset="0" stopColor="#f2a36b" stopOpacity=".1" />
                <stop offset=".45" stopColor="#ffc592" />
                <stop offset="1" stopColor="#f2a36b" stopOpacity=".55" />
              </linearGradient>
            </defs>
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path className="c g" pathLength={1} d="M112 142L285 22L636 200L636 236" stroke="url(#fcg)" strokeWidth="7" opacity=".18" />
              <path className="c" pathLength={1} d="M112 142L285 22L636 200L636 236" stroke="url(#fcg)" strokeWidth="2" />
              <path className="c" pathLength={1} d="M84 158L285 8L648 190" stroke="#f2a36b" strokeWidth="1.1" opacity=".55" />
              <path className="c" pathLength={1} d="M58 174L285 -6L660 182" stroke="#f2a36b" strokeWidth=".8" opacity=".3" />
              <path className="c g" pathLength={1} d="M4 214L174 146L548 258L586 272" stroke="url(#fcg)" strokeWidth="7" opacity=".18" />
              <path className="c" pathLength={1} d="M4 214L174 146L548 258L586 272" stroke="url(#fcg)" strokeWidth="2" />
              <path className="c" pathLength={1} d="M-6 232L176 134L560 246L610 262" stroke="#f2a36b" strokeWidth="1.1" opacity=".5" />
              <path className="c" pathLength={1} d="M286 28L286 194L174 152" stroke="#ffc592" strokeWidth="1.6" opacity=".8" />
            </g>
          </svg>
        </div>
        <div className="fr">
          <div className="fpill rv" style={k(4)}>
            <div className="fbw" ref={bw}>
              <EnquireButton className="fbook" source="Footer · Book a visit">
                Book a visit{" "}
                <i>
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12L12 2M5 2h7v7" />
                  </svg>
                </i>
              </EnquireButton>
            </div>
            <span className="fdv" aria-hidden="true"></span>
            <Ft
              href={MAPS_URL}
              label="Sales gallery, Plot 14, Kokapet, Hyderabad. Opens Google Maps"
              title="Sales gallery"
              sub="Plot 14, Kokapet, Hyderabad"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.6" />
                </svg>
              }
            />
            <span className="fdv" aria-hidden="true"></span>
            <Ft
              className="ft wa2"
              href={WA_GALLERY}
              label={`WhatsApp ${PHONE_LABEL}`}
              title="WhatsApp"
              sub={PHONE_LABEL}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3.6 20.4 5 15.6A8.6 8.6 0 1 1 8.5 19z" />
                  <path d="M9 8.6c.2 2.9 2.7 5.5 5.9 6.3l1-1.2-1.9-1-.8.7c-.9-.4-1.8-1.3-2.2-2.2l.7-.8-1-1.9z" fill="currentColor" stroke="none" />
                </svg>
              }
            />
            <a className="fcall" href={`tel:${PHONE}`} aria-label={`Call ${PHONE_LABEL}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 4h3.5l1.6 4.3-2.1 1.4a11 11 0 0 0 5.3 5.3l1.4-2.1 4.3 1.6V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" />
              </svg>
            </a>
          </div>
          <div className="fnav">
            {COLS.map((c) => (
              <NavCol key={c.title} {...c} />
            ))}
            <Newsletter />
          </div>
          <div className="fwm" aria-hidden="true">
            {[..."VelaHome"].map((c, i) => (
              <span className="gl" key={i} style={{ "--i": i } as CSSProperties}>
                {c}
              </span>
            ))}
          </div>
          <div className="fbar rv" style={k(11)}>
            <div className="fsoc">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube">
                <YouTubeIcon />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
            </div>
            <span className="fdv2" aria-hidden="true"></span>
            <span>Sample prices only. Not an offer.</span>
          </div>
        </div>
      </div>
      <p className="fcopy rv" style={k(12)}>
        © 2026 VelaHome. All rights reserved.
      </p>
    </footer>
  );
}
