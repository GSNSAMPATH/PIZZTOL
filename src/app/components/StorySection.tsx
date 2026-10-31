import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

export default function StorySection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Image */}
          <div className="relative h-[400px]  md:h-[640px] w-full overflow-hidden order-2 lg:order-1">
            <Image
              src="/095b7c2e0298a5f6f0a9909094daac19da168bbe.jpg"
              alt="Pizztol Our Story"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center text-center md:text-left order-1 lg:order-2">
            <h2 className="font-heading text-[24px] lg:text-[30px] xl:text-[34px] font-medium uppercase leading-[1.15] tracking-[0.04em] text-black sm:text-[40px] lg:text-[38px] xl:text-[40px]">
              More Than Just A T-Shirt
            </h2>

            <p className="mt-4 lg:mt-5 max-w-[600px] mx-auto md:mx-0 text-[14px] xl:text-[16px] leading-7 tracking-[0.02em] text-black/80">
              Pizztol creates everyday essentials with a focus on comfort,
              quality and effortless personal style.
            </p>

            <div className="mt-6 lg:mt-8">
              <Link
                href="/our-story"
                className="inline-flex py-4 md:h-[58px] items-center justify-center bg-black px-8 text-[12px] xl:text-[16px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#c90000]"
              >
                Our Story
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}