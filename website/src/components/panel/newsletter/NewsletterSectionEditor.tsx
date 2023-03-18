import React, { useEffect, useRef, useState } from "react";
import type NewsletterSection from "../../../types/NewsletterSection";
import { AnimateSharedLayout, motion } from "framer-motion";
import TextInput from "../TextInput";
import { FiGitCommit, FiImage, FiType } from "react-icons/fi/index.js";
import type {
  NewsletterContentBlock,
  NewsletterDividerBlock,
  NewsletterImageBlock,
  NewsletterTextBlock,
} from "../../../types/NewsletterContentBlock";
import NewsletterTextBlockEditor from "./NewsletterTextBlockEditor";
import NewsletterImageBlockEditor from "./NewsletterImageBlockEditor";
import NewsletterDividerBlockEditor from "./NewsletterDividerBlockEditor";
import NewsletterBlockEditorWrapper from "./NewsletterBlockEditorWrapper";
import {
  IoCaretDown,
  IoCaretUp,
  IoEllipsisVertical,
} from "react-icons/io5/index.js";
import NewsletterChangeOrderBar from "./NewsletterChangeOrderBar";
export default function NewsletterSectionEditor(props: {
  section: NewsletterSection;
  onChange: (section: NewsletterSection) => void;
  remove: () => void;
  moveUp: () => void;
  moveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
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

  const addBlock = (
    blockType: NewsletterContentBlock["type"],
    index: number
  ) => {
    const newBlocks = [...props.section.blocks];

    let newBlockGeneric: NewsletterContentBlock = {
      id: generateBlockId(),
      type: blockType,
    };

    if (blockType === "TEXT") {
      const newBlock = newBlockGeneric as NewsletterTextBlock;
      newBlock.content = "";

      newBlocks.splice(index, 0, newBlock);
    } else if (blockType === "IMAGE") {
      const newBlock = newBlockGeneric as NewsletterImageBlock;
      newBlock.publicId = "";
      newBlock.alt = "";

      newBlocks.splice(index, 0, newBlock);
    } else if (blockType === "DIVIDER") {
      const newBlock = newBlockGeneric as NewsletterDividerBlock;

      newBlocks.splice(index, 0, newBlock);
    }

    props.onChange({
      ...props.section,
      blocks: newBlocks,
    });
  };

  const [showDialogue, setShowDialogue] = useState(false);
  const dialogueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showDialogue) {
      const listener = (e: MouseEvent) => {
        if (
          dialogueRef.current &&
          !dialogueRef.current.contains(e.target as any)
        ) {
          setShowDialogue(false);
        }
      };

      document.addEventListener("click", listener);

      return () => {
        document.removeEventListener("click", listener);
      };
    }
  }, [showDialogue]);

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        duration: 0.8,
      }}
    >
      <div className="">
        <div className="flex items-center">
          <div className="rounded-xl bg-accent-c/5 py-4 px-8 flex w-full justify-between">
            <h3 className="text-lg font-sans font-semibold">{name}</h3>
            <div className="relative" ref={dialogueRef}>
              <div
                className="w-8 h-8 justify-center items-center flex hover:bg-accent-b/30 rounded-lg cursor-pointer text-accent-c"
                onClick={() => {
                  setShowDialogue(!showDialogue);
                }}
              >
                <IoEllipsisVertical />
              </div>
              <motion.div
                className="select-none top-full right-full z-10 absolute bg-white whitespace-nowrap p-2 text-mono-c font-os text-sm rounded-md shadow-sm border border-mono-border-light flex origin-top-right"
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: showDialogue ? 1 : 0,
                  scale: showDialogue ? 1 : 0,
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  bounce: 0.25,
                }}
              >
                <div className="absolute -right-4 -bottom-4">
                  <NewsletterChangeOrderBar
                    isFirst={props.isFirst}
                    isLast={props.isLast}
                    onMoveUp={props.moveUp}
                    onMoveDown={props.moveDown}
                    remove={props.remove}
                    show={showDialogue}
                  />{" "}
                </div>

                <div className="w-60 flex flex-col gap-5 p-2">
                  <TextInput
                    label={"Name"}
                    value={name}
                    onChange={setName}
                    smallLabel
                  />
                  <TextInput
                    label={"Style Classes"}
                    value={className}
                    onChange={setClassName}
                    smallLabel
                  />
                  <div className="flex gap-1 flex-wrap">
                    {presets.map((preset, key) => {
                      return (
                        <div
                          key={key}
                          className="text-xs flex flex-col gap-2 bg-accent-a/30  py-0.5 px-1.5 rounded-md hover:bg-accent-b/30 cursor-pointer text-accent-c"
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
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <AnimateSharedLayout>
            <div ref={blockContainerRef}>
              {(props.section.blocks ?? []).map((block, index) => (
                <NewsletterBlockEditorWrapper
                  key={block.id}
                  id={block.id}
                  addBlock={(blockType) => {
                    addBlock(blockType, index + 1);
                  }}
                >
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
        </div>
      </div>
    </motion.div>
  );
}

export const generateBlockId = () => {
  return Math.random().toString(36).substring(2, 9);
};
