"use client";

import { CSSProperties, ElementType, Fragment, ReactNode, RefObject, useRef } from "react";
import { useInView } from "@/lib/hooks";

type RevealProps = {
  as?: ElementType;
  className?: string;
  /** stagger step: delay = d × 80ms */
  d?: number;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
  /** optional extra ref to the rendered element */
  innerRef?: RefObject<HTMLElement | null>;
};

/** Fades and lifts its content in when it scrolls into view (.rv → .rv.in). */
export function Reveal({ as: Tag = "div", className = "", d, style, children, id, innerRef }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const s = d !== undefined ? ({ "--d": d, ...style } as CSSProperties) : style;
  const setRef = (el: HTMLElement | null) => {
    ref.current = el;
    if (innerRef) innerRef.current = el;
  };
  return (
    <Tag ref={setRef} id={id} className={`${className} rv${inView ? " in" : ""}`.trim()} style={s}>
      {children}
    </Tag>
  );
}

/**
 * An h2 whose words rise one after another when it scrolls into view.
 * `lines` is an array of lines; each line is an array of [text, emphasised?] parts.
 */
export function SplitHeading({ lines, className, id }: { lines: [string, boolean?][][]; className?: string; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { threshold: 0.2, fallbackMs: 1200, fallbackRatio: 0.9 });
  let n = 0;
  const word = (w: string) => (
    <span className="w" key={n}>
      <i style={{ "--i": n++ } as CSSProperties}>{w}</i>
    </span>
  );
  const words = (text: string) =>
    text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((s, k) => (/^\s+$/.test(s) ? <Fragment key={`s${n}-${k}`}> </Fragment> : word(s)));
  return (
    <h2 ref={ref} id={id} className={`${className ?? ""}${inView ? " in" : ""}`.trim() || undefined}>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.map(([text, em], pi) => (em ? <em key={pi}>{words(text)}</em> : <Fragment key={pi}>{words(text)}</Fragment>))}
        </Fragment>
      ))}
    </h2>
  );
}
