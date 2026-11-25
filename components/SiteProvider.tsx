"use client";

import { createContext, FormEvent, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { HOMES, PHONE, PHONE_LABEL, WA_NUMBER } from "@/lib/homes";
import { useFocusTrap } from "@/lib/hooks";
import { ArrowUpRight } from "./icons";

type SiteCtx = {
  /** Open the enquiry pop-up. `source` names the button so the lead shows where it came from. */
  openEnquiry: (source: string, home?: string | null, note?: string) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
};

const Ctx = createContext<SiteCtx | null>(null);

export function useSite() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite must be used inside <SiteProvider>");
  return c;
}

const OPTIONS = [...HOMES.map((h) => `${h.name} (${h.loc})`), "Not sure yet, help me choose", "Visit the sales gallery"];

export function SiteProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<{ source: string; note: string } | null>(null);
  const [interest, setInterest] = useState(OPTIONS[0]);
  const lastFocus = useRef<HTMLElement | null>(null);

  const openEnquiry = useCallback((source: string, home?: string | null, note = "") => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    if (home) {
      const o = OPTIONS.find((x) => x.startsWith(home + " ("));
      if (o) setInterest(o);
    }
    setModal({ source, note });
  }, []);

  const closeEnquiry = useCallback(() => {
    setModal(null);
    lastFocus.current?.focus?.();
  }, []);

  return (
    <Ctx.Provider value={{ openEnquiry, menuOpen, setMenuOpen }}>
      {children}
      <EnquiryModal state={modal} interest={interest} setInterest={setInterest} onClose={closeEnquiry} />
    </Ctx.Provider>
  );
}

/** Any button that opens the enquiry pop-up. */
export function EnquireButton({
  source,
  home,
  className,
  children,
  ...rest
}: { source: string; home?: string; className?: string; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openEnquiry } = useSite();
  return (
    <button
      type="button"
      className={className}
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openEnquiry(source, home);
      }}
    >
      {children}
    </button>
  );
}

function EnquiryModal({
  state,
  interest,
  setInterest,
  onClose,
}: {
  state: { source: string; note: string } | null;
  interest: string;
  setInterest: (v: string) => void;
  onClose: () => void;
}) {
  const open = state !== null;
  const ref = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errs, setErrs] = useState({ n: false, p: false });
  const [message, setMessage] = useState<string | null>(null);

  useFocusTrap(ref, open);

  useEffect(() => {
    if (!open) return;
    setMessage(null);
    const t = window.setTimeout(() => nameRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, state, onClose]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const p = phone.replace(/\D/g, "").slice(-10);
    const bad = { n: !n, p: p.length !== 10 };
    setErrs(bad);
    if (bad.n || bad.p) return;
    setMessage(`Hi VelaHome, I'm ${n} (${p}). I'm interested in: ${interest}.` + (state?.note ? ` ${state.note}.` : "") + ` [from: ${state?.source}]`);
  }

  return (
    <div className={`modal${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="mt" ref={ref} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mbox">
        <button className="x" aria-label="Close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
        <form noValidate onSubmit={submit} style={message ? { display: "none" } : undefined}>
          <h3 id="mt">
            Tell us what <em>you need</em>
          </h3>
          <p className="sub">Three details and we reply on WhatsApp.</p>
          <div className={`f${errs.n ? " bad" : ""}`}>
            <label htmlFor="n">Name</label>
            <input id="n" ref={nameRef} autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            <span className="err">Please add your name.</span>
          </div>
          <div className={`f${errs.p ? " bad" : ""}`}>
            <label htmlFor="p">Phone / WhatsApp</label>
            <input id="p" type="tel" inputMode="tel" autoComplete="tel" placeholder="98480 00000" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <span className="err">Enter a 10-digit mobile number.</span>
          </div>
          <div className="f">
            <label htmlFor="w">I am interested in</label>
            <select id="w" value={interest} onChange={(e) => setInterest(e.target.value)}>
              {OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <button className="btn" type="submit" style={{ width: "100%", justifyContent: "space-between" }}>
            Prepare my message{" "}
            <i>
              <ArrowUpRight />
            </i>
          </button>
        </form>
        <div className={`ok${message ? " show" : ""}`}>
          <h3>
            Almost <em>there</em>
          </h3>
          <div className="msg">{message}</div>
          <p className="sub" style={{ margin: "0 0 14px" }}>
            This page cannot send messages itself. Tap WhatsApp to send it, or call us.
          </p>
          <div className="mact">
            <a className="btn" target="_blank" rel="noopener" href={message ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}` : "#"}>
              Open WhatsApp{" "}
              <i>
                <ArrowUpRight />
              </i>
            </a>
            <a className="btn alt" href={`tel:${PHONE}`}>
              Call {PHONE_LABEL}{" "}
              <i>
                <ArrowUpRight />
              </i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
