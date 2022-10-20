import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function MeetingHeader(props: { children: string }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.1], [0.8, 1]);

  return (
    <motion.h2
      ref={ref}
      className="mx-auto max-w-3xl text-mono-a font-title text-2xl"
      style={{ scale }}
    >
      {props.children}
    </motion.h2>
  );
}
