import React, { useEffect, useState } from "react";
import type { NewsletterTextBlock } from "../../../types/NewsletterContentBlock";
import Editor from "../../Editor";
import NewsletterBlockEditorWrapper from "./NewsletterBlockEditorWrapper";

export default function NewsletterTextBlockEditor(props: {
  block: NewsletterTextBlock;
  onChange: (newBlock: NewsletterTextBlock) => void;
}) {
  const [content, setContent] = useState("");

  useEffect(() => {
    props.onChange({ ...props.block, content });
  }, [content]);

  return (
    <NewsletterBlockEditorWrapper label="Text Block">
      <Editor setBody={setContent} />
    </NewsletterBlockEditorWrapper>
  );
}
