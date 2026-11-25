import BudgetFinder from "@/components/BudgetFinder";
import Catalog from "@/components/Catalog";
import Consult from "@/components/Consult";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import ScrollChrome from "@/components/ScrollChrome";
import { SiteProvider } from "@/components/SiteProvider";

export default function Home() {
  return (
    <SiteProvider>
      <a href="#catalog" style={{ position: "absolute", left: -999 }}>
        Skip to homes
      </a>
      <Hero />
      <Catalog />
      <BudgetFinder />
      <Consult />
      <Faq />
      <Footer />
      <ScrollChrome />
      <Menu />
    </SiteProvider>
  );
}
