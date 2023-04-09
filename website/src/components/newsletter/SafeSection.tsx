import React from "react";
import type {
  NewsletterImageBlock,
  NewsletterMeetingExclusiveBlock,
  NewsletterTextBlock,
} from "../../types/NewsletterContentBlock";
import sanitizeHtml from "sanitize-html";
import type NewsletterSection from "../../types/NewsletterSection";
import { getImageURL } from "../../../public/createNewsletter";
import { IoLockClosed } from "react-icons/io5/index.js";

export default function SafeSection(props: { section: NewsletterSection }) {
  return (
    <div className="flex flex-col gap-8">
      {props.section.blocks.map((block, index) => {
        if (block.type === "TEXT") {
          const textBlock = block as NewsletterTextBlock;
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(textBlock.content, {
                  allowedAttributes: {
                    "*": ["style"],
                  },
                }),
              }}
            ></div>
          );
        } else if (block.type === "IMAGE") {
          const imageBlock = block as NewsletterImageBlock;
          const imageUrl = getImageURL(imageBlock);
          return (
            <div>
              <img key={index} src={imageUrl} alt={imageBlock.alt} />
              <p className="text-mono-c pt-2">{imageBlock.caption}</p>
            </div>
          );
        } else if (block.type === "DIVIDER") {
          return <hr key={index} />;
        } else if (block.type === "MEETING_EXCLUSIVE") {
          const meExBlock = block as NewsletterMeetingExclusiveBlock;
          return (
            <div
              key={index}
              className="flex gap-4 items-center bg-mono-container-light text-mono-c p-4 rounded-lg"
            >
              <IoLockClosed />
              <p>{meExBlock.text}</p>
            </div>
          );
        }

        return <div key={index}>Unknown block type</div>;
      })}
    </div>
  );
}
