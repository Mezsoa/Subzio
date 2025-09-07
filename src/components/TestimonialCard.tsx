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
        quote: "Saw this on X—following along. Curious to try once beta opens.",
        name: "Eric Jr",
        title: "On X (early interest)",
        img: "/testamonials/EricJr.webp",
      },
      {
        quote: "Looks promising. I hate surprise renewals. Keep me posted.",
        name: "Luis V.",
        title: "On X (early interest)",
        img: "/testamonials/LuisV.webp",
      },
      {
        quote: "Does it catch annual billing? That’s where I usually get burned.",
        name: "Sofia K",
        title: "On X (question)",
        img: "/testamonials/SofiaK.webp",
      },
      {
        quote: "Happy to try the MVP when it’s live.",
        name: "William D.",
        title: "On X (beta interest)",
        img: "/testamonials/WilliamD.webp",
      },
      {
        quote: "Following. Price and bank coverage will decide for me.",
        name: "Viktor N.",
        title: "On X (considering)",
        img: "/testamonials/viktorN.webp",
      },
      {
        quote: "Bookmarked. DM me when EU banks are supported.",
        name: "Jakob H.",
        title: "On X (request)",
        img: "/testamonials/JakobH.webp",
      },
      {
        quote: "Nice idea—interested if alerts are reliable.",
        name: "Lukas M.",
        title: "On X (early interest)",
        img: "/testamonials/LukasM.webp",
      },
    ],
    []
  );

  return (
    <div>
      <div className="mb-2 text-xs text-[color:var(--foreground)]/60">
        Early reactions from Twitter/X (pre‑launch)
      </div>
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
            className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 min-w-[300px] max-w-[400px]"
          >
            <div className="h-full px-3">
              <div className="h-full rounded-2xl border border-white/10 p-6 shadow-lg" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.35), rgba(255,255,255,0.04))" }}>
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
                    <div className="text-[color:var(--foreground)]/90 text-sm font-medium">{t.name}</div>
                    <div className="text-[color:var(--foreground)]/60 text-xs">{t.title}</div>
                  </div>
                </div>
                <p className="leading-relaxed text-sm" style={{ color: "var(--foreground)" }}>“{t.quote}”</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    </div>
  );
}

