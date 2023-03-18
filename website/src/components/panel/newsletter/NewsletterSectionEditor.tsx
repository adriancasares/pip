import React, { useEffect, useRef, useState } from "react";
import type NewsletterSection from "../../../types/NewsletterSection";
import { AnimateSharedLayout, motion } from "framer-motion";
import TextInput from "../TextInput";
import { FiGitCommit, FiImage, FiType } from "react-icons/fi/index.js";
import type {
  NewsletterDividerBlock,
  NewsletterImageBlock,
  NewsletterTextBlock,
} from "../../../types/NewsletterContentBlock";
import NewsletterTextBlockEditor from "./NewsletterTextBlockEditor";
import NewsletterImageBlockEditor from "./NewsletterImageBlockEditor";
import NewsletterDividerBlockEditor from "./NewsletterDividerBlockEditor";
import NewsletterBlockEditorWrapper from "./NewsletterBlockEditorWrapper";
export default function NewsletterSectionEditor(props: {
  section: NewsletterSection;
  onChange: (section: NewsletterSection) => void;
}) {
  const [name, setName] = useState(props.section.name);
  const [className, setClassName] = useState(props.section.className);

  useEffect(() => {
    props.onChange({
      ...props.section,
      name: name,
      className: className,
    });
  }, [name, className]);

  const presets: NewsletterSection[] = [
    {
      name: "Intro",
      className: "intro",
      blocks: [],
    },
    {
      name: "The Basics",
      className: "basics",
      blocks: [],
    },
    {
      name: "Advanced",
      className: "advanced",
      blocks: [],
    },
    {
      name: "Deep Dive",
      className: "deep-dive",
      blocks: [],
    },
    {
      name: "Conclusion",
      className: "conclusion",
      blocks: [],
    },
  ];

  const blockContainerRef = useRef<HTMLDivElement>(null);

  const adjustBlockContainerHeight = () => {
    // blockContainerRef.current!.style.height = `${
    //   blockContainerRef.current!.scrollHeight
    // }px`;
  };

  const generateBlockId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        duration: 0.8,
      }}
    >
      <div className="border-2 border-accent-c/50 border-dashed">
        <div className="bg-accent-c/10 py-4 px-8 flex flex-col gap-4">
          <p className="font-os text-mono-c text-sm">Section</p>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label={"Name"} value={name} onChange={setName} />
            <TextInput
              label={"Style Classes"}
              value={className}
              onChange={setClassName}
            />
          </div>
          <div className="flex font-os text-sm items-center gap-4">
            <p className="text-mono-c">Presets</p>
            <div className="flex flex-row gap-2">
              {presets.map((preset, key) => {
                return (
                  <div
                    key={key}
                    className="flex flex-col gap-2 bg-accent-a py-1 px-4 rounded-md hover:bg-accent-b cursor-pointer"
                    onClick={(e) => {
                      setName(preset.name);
                      setClassName(preset.className);
                    }}
                  >
                    <p>{preset.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <AnimateSharedLayout>
            <div ref={blockContainerRef}>
              {(props.section.blocks ?? []).map((block, index) => (
                <NewsletterBlockEditorWrapper label="Section">
                  {(() => {
                    if (block.type === "TEXT") {
                      return (
                        <NewsletterTextBlockEditor
                          key={block.id}
                          isFirst={index === 0}
                          isLast={index === props.section.blocks.length - 1}
                          onMoveUp={() => {
                            adjustBlockContainerHeight();

                            const newBlocks = props.section.blocks;
                            const temp = newBlocks[index];
                            newBlocks[index] = newBlocks[index - 1];
                            newBlocks[index - 1] = temp;

                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                          onMoveDown={() => {
                            adjustBlockContainerHeight();

                            const newBlocks = props.section.blocks;
                            const temp = newBlocks[index];
                            newBlocks[index] = newBlocks[index + 1];
                            newBlocks[index + 1] = temp;

                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                          block={block as NewsletterTextBlock}
                          onChange={(newBlock) => {
                            if (newBlock == null) {
                              const newBlocks = props.section.blocks;
                              newBlocks.splice(index, 1);

                              props.onChange({
                                ...props.section,
                                blocks: newBlocks,
                              });
                              return;
                            }
                            const newBlocks = props.section.blocks;
                            newBlocks[index] = newBlock;

                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                        />
                      );
                    } else if (block.type === "IMAGE") {
                      return (
                        <NewsletterImageBlockEditor
                          key={block.id}
                          block={block as NewsletterImageBlock}
                          onChange={(newBlock) => {
                            const newBlocks = props.section.blocks;
                            newBlocks[index] = newBlock;
                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                          onRemove={() => {
                            const newBlocks = props.section.blocks;
                            newBlocks.splice(index, 1);
                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                          isFirst={index === 0}
                          isLast={index === props.section.blocks.length - 1}
                          onMoveUp={() => {
                            adjustBlockContainerHeight();

                            const newBlocks = props.section.blocks;
                            const temp = newBlocks[index];
                            newBlocks[index] = newBlocks[index - 1];
                            newBlocks[index - 1] = temp;

                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                          onMoveDown={() => {
                            adjustBlockContainerHeight();

                            const newBlocks = props.section.blocks;
                            const temp = newBlocks[index];
                            newBlocks[index] = newBlocks[index + 1];
                            newBlocks[index + 1] = temp;

                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                        />
                      );
                    } else if (block.type === "DIVIDER") {
                      return (
                        <NewsletterDividerBlockEditor
                          key={block.id}
                          block={block as NewsletterDividerBlock}
                          onChange={(newBlock) => {
                            const newBlocks = props.section.blocks;
                            newBlocks[index] = newBlock;
                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                          isFirst={index === 0}
                          isLast={index === props.section.blocks.length - 1}
                          onMoveUp={() => {
                            adjustBlockContainerHeight();

                            const newBlocks = props.section.blocks;
                            const temp = newBlocks[index];
                            newBlocks[index] = newBlocks[index - 1];
                            newBlocks[index - 1] = temp;

                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                          onMoveDown={() => {
                            adjustBlockContainerHeight();

                            const newBlocks = props.section.blocks;
                            const temp = newBlocks[index];
                            newBlocks[index] = newBlocks[index + 1];
                            newBlocks[index + 1] = temp;

                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                          remove={() => {
                            const newBlocks = props.section.blocks;
                            newBlocks.splice(index, 1);
                            props.onChange({
                              ...props.section,
                              blocks: newBlocks,
                            });
                          }}
                        />
                      );
                    } else {
                      return <div>Unknown block type</div>;
                    }
                  })()}
                </NewsletterBlockEditorWrapper>
              ))}
            </div>
          </AnimateSharedLayout>
          <div className="flex flex-col gap-2 items-center font-os text-sm">
            <p className="text-mono-c">Add a Block</p>
            <div className="flex gap-2">
              <div
                className="flex flex-col items-center w-20 h-20 border border-mono-border-light justify-center gap-2 rounded-xl hover:bg-accent-b/20 cursor-pointer"
                onClick={() => {
                  const b: NewsletterTextBlock = {
                    type: "TEXT",
                    content: "",
                    id: generateBlockId(),
                  };

                  props.onChange({
                    ...props.section,
                    blocks: [...(props.section.blocks ?? []), b],
                  });
                }}
              >
                <FiType className="" />
                <p>Text</p>
              </div>
              <div
                className="flex flex-col items-center w-20 h-20 border border-mono-border-light justify-center gap-2 rounded-xl hover:bg-accent-b/20 cursor-pointer"
                onClick={() => {
                  const b: NewsletterImageBlock = {
                    type: "IMAGE",
                    publicId: "",
                    alt: "",
                    caption: "",
                    width: 0,
                    id: generateBlockId(),
                  };

                  props.onChange({
                    ...props.section,
                    blocks: [...(props.section.blocks ?? []), b],
                  });
                }}
              >
                <FiImage className="" />
                <p>Image</p>
              </div>
              <div
                className="flex flex-col items-center w-20 h-20 border border-mono-border-light justify-center gap-2 rounded-xl hover:bg-accent-b/20 cursor-pointer"
                onClick={() => {
                  const b: NewsletterDividerBlock = {
                    type: "DIVIDER",
                    id: generateBlockId(),
                  };

                  props.onChange({
                    ...props.section,
                    blocks: [...(props.section.blocks ?? []), b],
                  });
                }}
              >
                <FiGitCommit className="" />
                <p>Divider</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
