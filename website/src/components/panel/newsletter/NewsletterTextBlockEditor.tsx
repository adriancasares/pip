import React, { createRef, useEffect, useRef, useState } from "react";
import type { NewsletterTextBlock } from "../../../types/NewsletterContentBlock";
import Editor from "../../Editor";
import NewsletterBlockEditorWrapper from "./NewsletterBlockEditorWrapper";
import { motion } from "framer-motion";
import {
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoCaretDown,
  IoCaretUp,
  IoRemoveCircle,
} from "react-icons/io5/index.js";
import NewsletterChangeOrderBar from "./NewsletterChangeOrderBar";

export default function NewsletterTextBlockEditor(props: {
  block: NewsletterTextBlock;
  onChange: (newBlock: NewsletterTextBlock | undefined) => void;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [content, setContent] = useState(props.block.content);

  useEffect(() => {
    setContent(props.block.content);
  }, [props.block]);

  useEffect(() => {
    props.onChange({ ...props.block, content });
  }, [content]);

  const [focused, setFocused] = useState(false);

  return (
    <div
      className="relative pt-4"
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <NewsletterChangeOrderBar
          show={focused}
          isFirst={props.isFirst}
          isLast={props.isLast}
          onMoveUp={props.onMoveUp}
          onMoveDown={props.onMoveDown}
          remove={() => {
            props.onChange(undefined);
          }}
        />
      </div>
      <Editor setBody={setContent} initialBody={content} />
    </div>
  );
}
