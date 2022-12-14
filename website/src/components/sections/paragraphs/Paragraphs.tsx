import React, { useState, useRef, useEffect } from "react";

import Paragraph, { ParagraphData, ScrollFunction } from "./Paragraph";
import Carousel from "./Carousel";
import { AnimateSharedLayout } from "framer-motion";

export default function Paragraphs(props: { paragraphs: ParagraphData[] }) {
  const { paragraphs } = props;
  const [currentSection, setCurrentSection] = useState(0);

  const [scrollers, setScrollers] = useState<ScrollFunction[]>([]);

  const carouselRef = useRef(null);

  const [offScreen, setOffScreen] = useState(false);
  useEffect(() => {
    const listener = () => {
      if (!offScreen && carouselRef.current.getBoundingClientRect().top < 0) {
        setOffScreen(true);
      } else if (
        offScreen &&
        carouselRef.current.getBoundingClientRect().top > window.innerHeight / 2
      ) {
        setOffScreen(false);
      }
    };

    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, [offScreen]);

  return (
    <section id="paragraphs" class="w-full bg-black relative pb-36 select-none">
      <AnimateSharedLayout>
        <div class="px-10 mx-auto max-w-4xl flex justify-between">
          <div class="flex flex-col gap-36">
            {paragraphs.map((par, idx) => {
              return (
                <React.Fragment key={idx}>
                  <Paragraph
                    {...par}
                    idx={idx}
                    setScroll={(scroll) => {
                      setScrollers((prev) => {
                        prev[idx] = scroll;
                        return prev;
                      });
                    }}
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                  />
                </React.Fragment>
              );
            })}
          </div>
          <div
            class="sticky top-20 h-fit hidden 2xs:block"
            ref={!offScreen ? carouselRef : undefined}
          >
            {!offScreen && (
              <Carousel
                horizontal={false}
                count={paragraphs.length}
                currentSection={currentSection}
                scrollTo={(idx) => {
                  scrollers[idx]();
                }}
              />
            )}
          </div>
        </div>
        <div
          class="w-full h-0 2xs:h-20"
          ref={offScreen ? carouselRef : undefined}
        >
          <div class="mx-auto w-fit">
            {offScreen && (
              <Carousel
                horizontal={true}
                count={paragraphs.length}
                currentSection={currentSection}
                scrollTo={(idx) => {
                  scrollers[idx]();
                }}
              />
            )}
          </div>
        </div>
      </AnimateSharedLayout>
    </section>
  );
}
