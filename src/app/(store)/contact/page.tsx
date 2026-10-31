import { Mail, MessageCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import Footer from "../../components/Footer";


export default function ContactPage() {
  return (
    <>
      <main className="bg-white mt-20">
        {/* ================= GET IN TOUCH ================= */}
        <section className="pt-10 md:pt-20">
          <Container>
            <div className="mx-auto max-w-[1200px] text-center">
              <h1 className="font-heading text-[24px] lg:text-[30px] xl:text-[34px] font-medium font-semibold uppercase tracking-[0.05em] text-black sm:text-[40px] lg:text-[42px]">
                Get In Touch
              </h1>

              <p className="mx-auto mt-6 md:mt-12 max-w-[850px] font-sans text-[15px] leading-7 tracking-[0.03em] text-black/85 sm:text-[16px]">
                Have a question about our products, perfume decants or an
                existing order? We’re here to help. Reach out to us through
                any of the options below.
              </p>
            </div>

            {/* Contact Options */}
            <div className="mx-auto mt-16 grid max-w-[650px] grid-cols-1 gap-y-6 gap-10 sm:grid-cols-2 sm:gap-20">
              
              {/* Email */}
              <a
                href="mailto:hello@pizztol.com"
                className="group flex flex-col items-center text-center"
              >
                <Mail
                  size={30}
                  strokeWidth={2.2}
                  className="text-black transition-colors group-hover:text-[#c90000]"
                />

                <h2 className="mt-4 font-heading text-[18px] font-bold uppercase tracking-[0.1em]">
                  Email
                </h2>

                <p className="mt-2 font-sans text-[15px] tracking-[0.03em]">
                  hello@pizztol.com
                </p>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/94XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center"
              >
                <MessageCircle
                  size={30}
                  strokeWidth={2.2}
                  className="text-black transition-colors group-hover:text-[#c90000]"
                />

                <h2 className="mt-4 font-heading text-[18px] font-bold uppercase tracking-[0.1em]">
                  WhatsApp
                </h2>

                <p className="mt-2 font-sans text-[15px] tracking-[0.03em]">
                  +94 XX XXX XXXX
                </p>
              </a>

            </div>
          </Container>
        </section>

        {/* ================= SEND MESSAGE ================= */}
        <section className="pb-20 pt-20">
          <Container>
            <div className="mx-auto max-w-[820px]">

              {/* Heading */}
              <div className="text-center">
                <h2 className="font-heading text-[24px] lg:text-[30px] xl:text-[34px] font-medium uppercase tracking-[0.05em] text-black sm:text-[38px]">
                  Send Us A Message
                </h2>

                <p className="mt-6 md:mt-12 font-sans text-[14px] xl:text-[16px] leading-7 tracking-[0.03em] text-black/85 sm:text-[16px]">
                  Fill out the form below and our team will get back to you as
                  soon as possible.
                </p>
              </div>

              {/* Form */}
              <form className="mt-16 space-y-7">

                {/* Full Name */}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="h-[58px] w-full border border-black/80 bg-white px-7 font-sans text-[15px] tracking-[0.03em] outline-none placeholder:text-black/65 focus:border-[#c90000]"
                />

                {/* Phone + Email */}
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    className="h-[58px] w-full border border-black/80 bg-white px-7 font-sans text-[15px] tracking-[0.03em] outline-none placeholder:text-black/65 focus:border-[#c90000]"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    className="h-[58px] w-full border border-black/80 bg-white px-7 font-sans text-[15px] tracking-[0.03em] outline-none placeholder:text-black/65 focus:border-[#c90000]"
                  />
                </div>

                {/* Message */}
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  rows={6}
                  className="w-full resize-none border border-black/80 bg-white px-7 py-6 font-sans text-[15px] tracking-[0.03em] outline-none placeholder:text-black/65 focus:border-[#c90000]"
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="h-[58px] w-full bg-black font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#c90000]"
                >
                  Send Message
                </button>

              </form>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}