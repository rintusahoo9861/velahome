import type { HomeType } from "@/lib/homes";

/** ↗ arrow used on pill buttons */
export const ArrowUpRight = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M2 12L12 2M5 2h7v7" />
  </svg>
);

/** → arrow, 24px grid */
export const ArrowRight = ({ sw = 2 }: { sw?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

const Ic2 = ({ d, children }: { d?: string; children?: React.ReactNode }) => (
  <svg className="ic2" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d && <path d={d} />}
    {children}
  </svg>
);

export const TypeIcon = ({ type }: { type: HomeType }) =>
  type === "Villa" ? (
    <Ic2 d="M2.5 9.5 10 3l7.5 6.5M4.5 8.5V17h11V8.5M8 17v-5h4v5" />
  ) : type === "Cottage" ? (
    <Ic2 d="M16 3C8 3 4 7 4 12a5 5 0 0 0 5 5c5 0 7-5 7-14ZM4 17c2-5 5-8 9-10" />
  ) : (
    <Ic2 d="M3 5h14M3 10h14M3 15h14M6 5v10M14 5v10" />
  );

export const PinIcon = () => (
  <Ic2 d="M10 18s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z">
    <circle cx="10" cy="8" r="2" />
  </Ic2>
);
export const BedIcon = () => <Ic2 d="M2 16V4M2 12h16v4M18 12v-2a3 3 0 0 0-3-3H8v5" />;
export const AreaIcon = () => <Ic2 d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4" />;
export const CalIcon = () => (
  <Ic2 d="M3 8h14M7 2v4M13 2v4">
    <rect x="3" y="4" width="14" height="13" rx="2" />
  </Ic2>
);

/** small house used in the budget-finder chips */
export const HouseChipIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 9.5 10 3l7.5 6.5M4.5 8.5V17h11V8.5M8 17v-5h4v5" />
  </svg>
);

export const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none" />
  </svg>
);
export const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <rect x="2.5" y="5" width="19" height="14" rx="4.5" />
    <path d="M10 9.3v5.4l4.7-2.7z" fill="currentColor" stroke="none" />
  </svg>
);
export const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5.2 9.2h2.9V19H5.2zM6.65 4.6a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4M10.2 9.2H13v1.3h.04c.4-.75 1.35-1.55 2.8-1.55 3 0 3.55 1.95 3.55 4.5V19h-2.9v-4.7c0-1.1 0-2.55-1.55-2.55s-1.8 1.2-1.8 2.45V19h-2.9z" />
  </svg>
);
