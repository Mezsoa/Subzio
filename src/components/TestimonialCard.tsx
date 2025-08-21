'use client'
import React, { useMemo } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/Carousel";
import AutoScroll from "embla-carousel-auto-scroll";

type Testimonial = {
  quote: string;
  name: string;
  title: string;
  img: string;
};

export default function TestimonialCard() {
  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        quote: "I’d happily pay $10/mo just to never get burned by forgotten renewals again.",
        name: "Eric Jr",
        title: "SaaS founder",
        img: "/testamonials/EricJr.webp",
      },
      {
        quote: "I’d pay double for the peace of mind of not having to worry about forgotten subscriptions.",
        name: "Luis V.",
        title: "E‑commerce",
        img: "/testamonials/LuisV.webp",
      },
      {
        quote: "One missed annual renewal cost me $199 last year—this would’ve easily been worth it.",
        name: "Sofia K",
        title: "Indie hacker",
        img: "/testamonials/SofiaK.webp",
      },
      {
        quote: "If SubKill existed sooner, I wouldn’t have eaten $300 in 'free trial' fees. Take my money.",
        name: "William D.",
        title: "Founder",
        img: "/testamonials/WilliamD.webp",
      },
      {
        quote: "The day‑before alerts alone are worth the price—I’d pay just for those.",
        name: "Victor N.",
        title: "Product designer",
        img: "/testamonials/viktorN.webp",
      },
      {
        quote: "I budget for Netflix and 12 random tools I forgot last year. This would be a no‑brainer subscription.",
        name: "Jakob H.",
        title: "Creator",
        img: "/testamonials/JakobH.webp",
      },
      {
        quote: "I like the idea of it. I’d keep paying to never think about cancellations again.",
        name: "Lukas M.",
        title: "Developer",
        img: "/testamonials/LukasM.webp",
      },
    ],
    []
  );

  return (
    <Carousel
      opts={{ align: "start", loop: true, dragFree: true, direction: 'ltr' }}
      plugins={[
        AutoScroll({
          direction: 'forward',
          speed: 0.8,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ] as unknown as NonNullable<React.ComponentProps<typeof Carousel>["plugins"]>}
      className="select-none"
    >
      <CarouselContent className="py-2 transform-gpu will-change-transform">
        {testimonials.concat(testimonials).map((t, i) => (
          <CarouselItem
            key={i}
            className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 min-w-[300px] max-w-[400px] "
          >
            <div className="h-full px-3">
              <div className="h-full rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 overflow-hidden rounded-full">
                    <Image
                      src={t.img}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  <div>
                    <div className="text-white/90 text-sm font-medium">{t.name}</div>
                    <div className="text-white/60 text-xs">{t.title}</div>
                  </div>
                </div>
                <p className="text-white/85 leading-relaxed text-sm">“{t.quote}”</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

