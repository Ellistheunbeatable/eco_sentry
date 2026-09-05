import LenisProvider from "@/components/LenisProvider";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Mission from "@/components/Mission";
import Architecture from "@/components/Architecture";
import ZoneScan from "@/components/ZoneScan";
import ScoreEngine from "@/components/ScoreEngine";
import Manifest from "@/components/Manifest";
import CodeDeck from "@/components/CodeDeck";
import KillerLine from "@/components/KillerLine";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <LenisProvider />
      <Preloader />
      <Cursor />
      <div className="noise-overlay" aria-hidden />
      <Navbar />
      <Hero />
      <Marquee />
      <Mission />
      <Architecture />
      <ZoneScan />
      <Marquee dark />
      <ScoreEngine />
      <Manifest />
      <CodeDeck />
      <KillerLine />
      <Footer />
    </main>
  );
}
