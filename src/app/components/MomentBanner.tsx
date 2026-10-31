import Image from "next/image";
import Container from "./Container";

interface PromoBannerProps {
  image_Desctop: string;
  image_Mobile?: string;
  iteminmobile: " items-center" | "items-start" | "items-end";
  title: string;
  title2?: string;
  highlight: string;
  alt?: string;
  height?: string;
}

export default function PromoBanner({
  image_Desctop,
  image_Mobile,
  iteminmobile,
  title,
  title2,
  highlight,
  alt = "",
  height = "h-[200px] md:h-[500px]",
}: PromoBannerProps) {
  return (
    <section
      className={`relative ${height} w-full overflow-hidden bg-black`}
    >
      {/* Background Image */}
      <Image
        src={image_Desctop}
        alt={alt}
        fill
        className="object-cover object-right hidden md:block"
        sizes="100vw"
      />

      {/* Mobile Background Image */}
      {image_Mobile && (
        <Image
          src={image_Mobile}
          alt={alt}
          fill
          className="object-cover object-right md:hidden"
          sizes="100vw"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className={`relative z-10 flex h-full md:items-center py-10 md:py-0 justify-end h-full  ${iteminmobile}`}>
        <Container>
          <h1 className="pl-1 text-[34px] sm:text-[42px] lg:text-[52px] xl:text-[62px] text-center md:text-start font-bold uppercase leading-[50px] md:leading-[62px] xl:leading-[78px] tracking-[8%] xl:tracking-[8%] text-white ">
            {title}
            <br />
            {title2}{" "}
            <span className="text-[#c90000]">
              {highlight}
            </span>
          </h1>
        </Container>
      </div>
    </section>
  );
}