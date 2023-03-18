import React, { useState } from "react";
import type { NewsletterDividerBlock } from "../../../types/NewsletterContentBlock";
import NewsletterChangeOrderBar from "./NewsletterChangeOrderBar";
import { motion } from "framer-motion";

export default function NewsletterDividerBlockEditor(props: {
  block: NewsletterDividerBlock;
  onChange: (newBlock: NewsletterDividerBlock) => void;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  remove: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative flex items-center py-4"
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <NewsletterChangeOrderBar
          isFirst={props.isFirst}
          isLast={props.isLast}
          onMoveUp={props.onMoveUp}
          onMoveDown={props.onMoveDown}
          show={hover}
          remove={props.remove}
        />
      </div>
      <div className="w-full border-b border-b-mono-border-light" />
    </div>
  );
}
