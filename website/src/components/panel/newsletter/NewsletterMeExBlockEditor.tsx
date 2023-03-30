import React, { useState } from "react";
import type {
  NewsletterDividerBlock,
  NewsletterMeetingExclusiveBlock,
} from "../../../types/NewsletterContentBlock";
import NewsletterChangeOrderBar from "./NewsletterChangeOrderBar";
import { motion } from "framer-motion";
import { IoLockClosed } from "react-icons/io5/index.js";
import MetadataTextInput from "./MetadataTextInput";
import TextInput from "../TextInput";

export default function NewsletterMeExBlockEditor(props: {
  block: NewsletterMeetingExclusiveBlock;
  onChange: (newBlock: NewsletterMeetingExclusiveBlock) => void;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  remove: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [name, setName] = useState("");
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
      <div className="w-full bg-mono-container-light flex items-center gap-8 py-4 px-8 rounded-lg">
        <IoLockClosed />
        <TextInput value={name} onChange={setName} label="Meeting Exclusive" />
      </div>
    </div>
  );
}
