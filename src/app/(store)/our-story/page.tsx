import {
  Fingerprint,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import Footer from "../../components/Footer";

const beliefs = [
  {
    title: "Individuality",
    description: "Style that reflects your personality.",
    icon: Fingerprint,
  },
  {
    title: "Quality",
    description: "Carefully selected products made to be enjoyed.",
    icon: ShieldCheck,
  },
  {
    title: "Confidence",
    description: "Everyday essentials that help you feel your best.",
    icon: TrendingUp,
  },
];

export default function OurStoryPage() {
  return (
    <>
      <main className="bg-white mt-20">

        {/* ================= OUR STORY ================= */}
        <section className="py-10 md:py-20">
          <Container>
            <div className="mx-auto max-w-[900px] text-center">

              <h1 className="text-[24px] lg:text-[30px] xl:text-[34px] font-medium uppercase tracking-[0.05em] text-black sm:text-[40px] lg:text-[42px]">
                Our Story
              </h1>

              <div className="mt-6 md:mt-12 space-y-4 md:space-y-8 font-sans text-[14px] xl:text-[16px] leading-[28px] tracking-[4%] text-black/85 sm:text-[16px] sm:leading-7">
                <p>
                  PIZZTOL was created with a simple idea - to bring style and
                  individuality into everyday life. We believe that what you
                  wear and the scent you choose are more than small details;
                  they are personal expressions of who you are. That is why
                  our collection brings together distinctive T-shirts and
                  carefully selected perfume decants designed to complement
                  different styles, moods and personalities.
                </p>

                <p>
                  Our approach is centred on simplicity, confidence and
                  authenticity. Every item is chosen with attention to
                  quality, character and everyday comfort, allowing you to
                  create a style that feels genuinely yours. Whether it is a
                  T-shirt that makes a statement or a fragrance that becomes
                  your signature, PIZZTOL is here to help you express yourself
                  effortlessly.
                </p>
              </div>

            </div>
          </Container>
        </section>

        {/* ================= WHAT WE BELIEVE ================= */}
        <section className="pb-20 pt-10 md:pt-0">
          <Container>
            <div className="mx-auto max-w-[950px] text-center">

              <h2 className="font-heading text-[24px] lg:text-[30px] xl:text-[34px] font-medium uppercase tracking-[0.05em] text-black sm:text-[40px] lg:text-[42px]">
                What We Believe
              </h2>

              <p className="mx-auto mt-6 md:mt-12 max-w-[900px] font-sans text-[14px] xl:text-[16px] leading-[28px] tracking-[4%] text-black/85 sm:text-[16px]">
                We believe personal style should feel effortless, confident
                and authentic. That is why we focus on carefully selected
                products that combine character, quality and everyday
                usability. From what you wear to the fragrance you choose,
                every detail should help you express yourself in your own way.
              </p>

            </div>

            {/* Beliefs */}
            <div className="mx-auto mt-16 grid max-w-[1050px] grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">

              {beliefs.map((belief) => {
                const Icon = belief.icon;

                return (
                  <div
                    key={belief.title}
                    className="flex flex-col items-center text-center"
                  >
                    <Icon
                      size={28}
                      strokeWidth={2.2}
                      className="text-black"
                    />

                    <h3 className="mt-5 font-heading lg:text-[18px] xl:text-[20px] font-bold uppercase tracking-[0.12em] text-black">
                      {belief.title}
                    </h3>

                    <p className="mt-3 max-w-[280px] text-[14px] xl:text-[16px] leading-6 tracking-[0.025em] text-black/85">
                      {belief.description}
                    </p>
                  </div>
                );
              })}

            </div>
          </Container>
        </section>
      </main>
    </>
  );
}