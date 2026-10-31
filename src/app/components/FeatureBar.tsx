import {
  FaTruck,
  FaStar,
  FaCircleCheck,
  FaCottonBureau,
} from "react-icons/fa6";
import Container from "./Container";

const features = [
  {
    icon: FaCottonBureau,
    title: "100%",
    subtitle: "Premium Cotton",
  },
  {
    icon: FaCircleCheck,
    title: "Exclusive",
    subtitle: "Designs",
  },
  {
    icon: FaTruck,
    title: "Islandwide",
    subtitle: "Delivery",
  },
  {
    icon: FaStar,
    title: "4.9/5",
    subtitle: "Customer Rating",
  },
];

export default function FeatureBar() {
  return (
    <section className="bg-black text-white">
      <Container>
        <div className="grid min-h-[130px] grid-cols-3 sm:grid-cols-4 md:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`relative flex items-center justify-center ${index === 3 ? "hidden sm:flex" : ""}`}
              >
                <div className="flex flex-col items-center text-center">
                  <Icon className="mb-2 h-[22px] w-[22px]" />

                  <h1 className="text-[12px] lg:text-[14px] font-semibold leading-5 tracking-[0.08em]">
                    {feature.title}
                  </h1>

                  <h2 className="text-[12px] lg:text-[14px] font-medium leading-5 tracking-[0.08em]">
                    {feature.subtitle}
                  </h2>
                </div>

                {/* Red separator */}
                <span
                className={`absolute right-0 h-[32px] w-[1px] bg-[#c90000] ${
                    index === 2 ? "hidden sm:block" : ""
                } ${index === 3 ? "hidden" : ""}`}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}