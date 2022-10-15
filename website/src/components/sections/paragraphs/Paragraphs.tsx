import React, { useState } from "react";

import Paragraph, { ParagraphData, ScrollFunction } from "./Paragraph";
import Carousel from "./Carousel";

export default function Paragraphs(props: { paragraphs: ParagraphData[] }) {
  const { paragraphs } = props;
  const [currentSection, setCurrentSection] = useState(0);

  const [scrollers, setScrollers] = useState<ScrollFunction[]>([]);
  return (
    <section id="paragraphs" class="w-full bg-black relative pb-36">
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
        <div class="sticky top-20 h-fit">
          <Carousel
            count={paragraphs.length}
            currentSection={currentSection}
            scrollTo={(idx) => {
              scrollers[idx]();
            }}
          />
        </div>
      </div>
    </section>
  );
}
