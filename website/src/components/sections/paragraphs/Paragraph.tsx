import React, { useEffect, useRef, useState, useMemo } from "react";
import { marked } from "marked";
import "./Paragraph.css";

export default function Paragraph(props: {
  header: string;
  body: string;
  idx: number;
  currentSection: number;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { header, body, idx, setCurrentSection } = props;
  const parsed = marked.parse(body);

  let ref = useRef<HTMLDivElement>(null);

  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const listener = () => {
      const position = ref.current.getBoundingClientRect();
      const bottom = window.innerHeight - position.top;

      if (bottom > window.innerHeight / 2) {
        setCurrentSection(idx);
      }

      if (position.top < 0) {
        setOpacity(1 - (position.top * -2) / position.height);
      } else if (bottom < window.innerHeight / 3) {
        setOpacity((bottom * 3) / window.innerHeight);
      } else setOpacity(1);
    };

    listener();

    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  return (
    <div class="text-mono-a max-w-sm flex flex-col gap-4 relative" ref={ref}>
      <div class="sticky top-20 h-fit" style={{ opacity }}>
        <h3 class="font-title text-lg">{header}</h3>
        <div
          class="font-sans body"
          dangerouslySetInnerHTML={{ __html: parsed }}
        ></div>
      </div>
      <div class="h-[50vh]" />
    </div>
  );
}

export interface ParagraphData {
  header: string;
  body: string;
}
