export type HomeType = "Villa" | "Cottage" | "Townhouse";

export type Home = {
  name: string;
  /** full price in crore rupees */
  cr: number;
  bhk: number;
  loc: string;
  typ: HomeType;
  sf: number;
  handover: string;
  /** background-position of the garden photo behind the cut-out house */
  bgPos: string;
  /** width of the cut-out house in the catalog card */
  w: string;
  /** 1 or -1: mirrors the cut-out house */
  f: 1 | -1;
  /** colour wash over the picture, if any */
  tint?: string;
  /** width of the house in the budget-finder preview card */
  hw: string;
};

export const HOMES: Home[] = [
  { name: "Aarav Villa", cr: 4.9, bhk: 4, loc: "Kokapet", typ: "Villa", sf: 3850, handover: "Mar 2027", bgPos: "30% 62%", w: "86%", f: 1, hw: "129%" },
  { name: "Meadow Cottage", cr: 2.1, bhk: 3, loc: "Shamirpet", typ: "Cottage", sf: 2100, handover: "Dec 2026", bgPos: "82% 50%", w: "96%", f: -1, tint: "rgba(255,170,80,.20)", hw: "144%" },
  { name: "Cantilever House", cr: 7.4, bhk: 5, loc: "Gachibowli", typ: "Villa", sf: 5200, handover: "Aug 2027", bgPos: "8% 40%", w: "74%", f: 1, tint: "rgba(40,60,140,.24)", hw: "111%" },
  { name: "Teak Row 07", cr: 3.2, bhk: 3, loc: "Narsingi", typ: "Townhouse", sf: 2650, handover: "Feb 2027", bgPos: "60% 85%", w: "90%", f: -1, hw: "135%" },
  { name: "Courtyard Cottage", cr: 1.35, bhk: 2, loc: "Moinabad", typ: "Cottage", sf: 1450, handover: "Nov 2026", bgPos: "40% 30%", w: "80%", f: 1, tint: "rgba(255,130,70,.26)", hw: "120%" },
  { name: "Terrace Villa", cr: 4.1, bhk: 4, loc: "Financial District", typ: "Villa", sf: 3300, handover: "Jun 2027", bgPos: "100% 60%", w: "92%", f: -1, tint: "rgba(20,40,70,.18)", hw: "138%" },
];

export const PHONE = "+919848000000";
export const PHONE_LABEL = "+91 98480 00000";
export const WA_NUMBER = "919848000000";
export const WA_GALLERY = `https://wa.me/${WA_NUMBER}?text=Hi%20VelaHome%2C%20I%27d%20like%20to%20visit%20the%20sales%20gallery.`;
export const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Plot+14+Kokapet+Hyderabad";

/** Homes that fit a budget (crore) and a bedroom choice (0 = any, 5 = 5+). */
export function homesThatFit(budget: number, bhk: number) {
  return HOMES.map((h, i) => ({ ...h, i })).filter(
    (h) => h.cr <= budget + 1e-9 && (bhk === 0 || (bhk === 5 ? h.bhk >= 5 : h.bhk === bhk))
  );
}

/** Monthly instalment on 80% of the price, 8.5% a year, 20 years. */
export function emiLakh(budgetCr: number) {
  const P = budgetCr * 1e7 * 0.8;
  const r = 0.085 / 12;
  const N = 240;
  const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
  return (emi / 1e5).toFixed(2);
}
