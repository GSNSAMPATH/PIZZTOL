import Image from "next/image";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureBar from "../components/FeatureBar";
import TShirtSection from "../components/T-shartSection";
import MomentBanner from "../components/MomentBanner";
import PerfumeSection from "../components/PerfumeSection";
import StorySection from "../components/StorySection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureBar />
      <TShirtSection />
      <MomentBanner
        image_Desctop="/2318a2f3bc2d853f01f2bc7fbf83ce56a1405e5c.png"
        image_Mobile="/dbcc7ccef7360ad03a912d7cc2a7fe6c67c5adf8 (1).png"
        iteminmobile="items-start"
        title="made for"
        title2="every"
        highlight="Moment"
        alt="Pizztol Moments Banner"
        height="h-[500px] md:h-[500px]"
      />
      <PerfumeSection />
      <MomentBanner
        image_Desctop="/56637de3273fb91a0cc731aed35df2466d275d19.png"
        image_Mobile="/56637de3273fb91a0cc731aed35df2466d275d19.png"
        iteminmobile="items-end"
        title="FIND YOUR"
        title2="SIGNATURE "
        highlight="SCENT"
        alt="Pizztol Moments Banner"
        height="h-[500px] md:h-[500px]"
      />
      <StorySection />
    </>
  );
}
