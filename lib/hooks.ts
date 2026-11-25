"use client";

import { RefObject, useEffect, useState } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
}

/**
 * Becomes true once the element scrolls into view (and stays true).
 * `fallbackMs`: after this delay, anything already above the fold is shown anyway,
 * so a missed observer callback never leaves content hidden.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.12, fallbackMs = 1500, fallbackRatio = 1 }: { threshold?: number; fallbackMs?: number; fallbackRatio?: number } = {}
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    const t = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight * fallbackRatio) setInView(true);
    }, fallbackMs);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [ref, threshold, fallbackMs, fallbackRatio]);
  return inView;
}

/** Keeps keyboard focus inside `container` while `active`. */
export function useFocusTrap(container: RefObject<HTMLElement | null>, active: boolean, selector = "a[href],button,input,select") {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !container.current) return;
      const f = [...container.current.querySelectorAll<HTMLElement>(selector)].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const a = f[0];
      const z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [container, active, selector]);
}
