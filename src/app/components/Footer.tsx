import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa6";
import Container from "./Container";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white">
      <Container>
        <div className="flex min-h-[250px] items-center py-14">
          <div className="flex w-full flex-col gap-10 md:flex-row items-center md:items-start ">

            {/* Logo */}
            <div className="shrink-0 lg:w-[265px]">
              <Link
                href="/"
                className="font-heading text-[40px] font-black tracking-[-0.05em]"
              >
                <Image
                  src="/PIZZTOL (1).png"
                  alt="Logo"
                  width={1080}
                  height={720}
                  className="object-contain h-[80px] w-[250px]"
                />
              </Link>
            </div>

            {/* Divider */}
            <div className="hidden h-[92px] w-px bg-white/30 md:block" />

            {/* Navigation + Copyright */}
            <div className="flex md:flex-1 flex-col items-center md:items-start justify-center gap-5 w-full">
              <nav className="flex flex-wrap  gap-x-8 gap-y-3">
                <Link
                  href="/"
                  className="font-heading text-[15px] font-medium tracking-[0.08em] transition-colors hover:text-[#c90000]"
                >
                  Home
                </Link>

                <Link
                  href="/our-story"
                  className="font-heading text-[15px] font-medium tracking-[0.08em] transition-colors hover:text-[#c90000]"
                >
                  Our Story
                </Link>

                <Link
                  href="/contact"
                  className="font-heading text-[15px] font-medium tracking-[0.08em] transition-colors hover:text-[#c90000]"
                >
                  Contact
                </Link>

                <Link
                  href="/privacy-policy"
                  className="font-heading text-[15px] font-medium tracking-[0.08em] transition-colors hover:text-[#c90000]"
                >
                  Privacy Policy
                </Link>
              </nav>

              <p className="font-sans text-[13px] tracking-[0.08em] text-white/90">
                © 2026 Pizztol. All Rights Reserved.
              </p>
            </div>

            {/* Social + Developer */}
            <div className="flex flex-col gap-6 lg:items-end">
              
              <div className="flex w-full items-center justify-center md:justify-start gap-6">
                <Link
                  href="#"
                  aria-label="Instagram"
                  className="transition-colors hover:text-[#c90000]"
                >
                  <FaInstagram size={17} />
                </Link>

                <Link
                  href="#"
                  aria-label="Facebook"
                  className="transition-colors hover:text-[#c90000]"
                >
                  <FaFacebookF size={16} />
                </Link>

                <Link
                  href="#"
                  aria-label="YouTube"
                  className="transition-colors hover:text-[#c90000]"
                >
                  <FaYoutube size={19} />
                </Link>

                <Link
                  href="#"
                  aria-label="TikTok"
                  className="transition-colors hover:text-[#c90000]"
                >
                  <FaTiktok size={17} />
                </Link>
              </div>

              <p className="font-sans text-[12px] tracking-[0.08em] text-white/90">
                Developed by Novrith Technology
              </p>
            </div>

          </div>
        </div>
      </Container>
    </footer>
  );
}