import { FanIcon, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import Container from "./Container";


export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <Container>
        <div className="mx-auto flex pt-30 md:pt-20 flex-col md:min-h-[600px] xl:min-h-[750px] md:flex-row">
        {/* ================= LEFT CONTENT ================= */}
        <div className="relative z-10 flex w-full md:w-[47%] flex-col justify-center items-center md:items-start">
          {/* Collection label */}
          <p className="mb-2 lg:mb-5 text-[14px] lg:text-[18px] font-semibold text-center uppercase tracking-[0.22em] text-[#c90000]">
            New Collection 2026
          </p>

          {/* Main heading */}
          <h1 className="relative lg:-left-1 text-[34px] sm:text-[42px] lg:text-[52px] xl:text-[62px] text-center md:text-start font-bold uppercase leading-[50px] md:leading-[62px] xl:leading-[78px] tracking-[6%] md:tracking-[8%] xl:tracking-[8%] text-black">
            Everyday Style
            <br />
            <span className="text-[#c90000]">Elevated</span>
          </h1>

          {/* Description */}
          <p className="mt-2 lg:mt-5 max-w-[350px] text-center md:text-start text-[14px] xl:text-[16px] leading-7 tracking-[0.02em] text-black/75">
            Designed for everyday comfort.
            <br />
            Made to stand out.
          </p>

          {/* CTA */}
          <div className="mt-6 lg:mt-8">
            <Link
              href="/shop"
              className="inline-flex py-4 md:h-[58px] items-center justify-center bg-black px-8 text-[12px] xl:text-[16px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#c90000]"
            >
              Shop the Collection
            </Link>
          </div>

          {/* Social + Scroll */}
          <div className="hidden xl:mt-12 xl:flex lg:items-end lg:gap-4">
            {/* Scroll */}
            <div className="flex h-[78px] flex-col items-center justify-between border-l-2 border-black pl-1">
              <span className="text-[10px] font-bold tracking-[0.08em] [writing-mode:vertical-rl]">
                Scroll
              </span>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-5 pb-0.5">
              <Link
                href="#"
                aria-label="Instagram"
                className="transition-transform hover:-translate-y-1"
              >
                <FaInstagram size={32} strokeWidth={2.4} className="h-6.5 w-6.5" />
              </Link>

              <Link
                href="#"
                aria-label="Facebook"
                className="transition-transform hover:-translate-y-1"
              >
                <FaFacebook
                  size={32}
                  fill="currentColor"
                  strokeWidth={0}
                  className="h-6 w-6"
                />
              </Link>

              <Link
                href="#"
                aria-label="YouTube"
                className="transition-transform hover:-translate-y-1"
              >
                <FaYoutube
                  size={32}
                  fill="currentColor"
                  strokeWidth={0}
                  className="h-8 w-8"
                />
              </Link>

              <Link
                href="#"
                aria-label="TikTok"
                className="transition-transform hover:-translate-y-1"
              >
                <FaTiktok
                  size={32}
                  fill="currentColor"
                  strokeWidth={0}
                  className="h-6 w-6"
                />
              </Link>
            </div>
          </div>
        </div>

<div className="relative mt-10 z-10 w-full md:hidden aspect-[4/4]">
  <Image
    src="/26fc42f597b94bf0edae1ce8da4aa717779d7281.png"
    alt="Pizztol New Collection 2026"
    fill
    priority
    className="object-contain object-bottom"
    sizes="100vw"
  />
</div>

        {/* ================= RIGHT MODEL ================= */}
        <div className="hidden md:block relative w-full md:min-h-[520px] md:w-[53%]">
          {/* Model */}
          <div className="md:absolute h-[520px] inset-x-0 bottom-0 top-8 md:left-[-40] h-full">
            <Image
              src="/26fc42f597b94bf0edae1ce8da4aa717779d7281.png"
              alt="Pizztol New Collection 2026"
              fill
              priority
              className="object-contain object-bottom"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>

          {/* Vertical text */}
        <div className="hidden lg:block absolute right-0 top-1/2 hidden -translate-y-1/2 lg:flex lg:h-[390px] xl:h-[460px] flex-col items-center">
          <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c90000] xl:text-[14px] [writing-mode:vertical-rl]">
            Made for every moment
          </span>

          <div className="hidden md:block relative mt-4 h-[160px] w-[1.5px] overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[1.5px] bg-[#c90000] animate-line-jump" />
          </div>
        </div>
      </div>
    </div>
  </Container>
</section>
  );
}