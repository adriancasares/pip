import type React from "react";
import { useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi/index.js";
import { IoAdd, IoText } from "react-icons/io5/index.js";
import { motion } from "framer-motion";
import type { NewsletterContentBlock } from "../../../types/NewsletterContentBlock";
export default function NewsletterBlockEditorWrapper(props: {
  children: any;
  addBlock: (blockType: NewsletterContentBlock["type"]) => void;
  id: string;
}) {
  const [showAddDialogue, setShowAddDialogue] = useState(false);

  const sideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showAddDialogue) {
      const listener = (e: MouseEvent) => {
        if (sideRef.current && !sideRef.current.contains(e.target as any)) {
          setShowAddDialogue(false);
        }
      };

      document.addEventListener("click", listener);

      return () => {
        document.removeEventListener("click", listener);
      };
    }
  }, [showAddDialogue]);

  const addBlock = (blockType: NewsletterContentBlock["type"]) => {
    props.addBlock(blockType);
    setShowAddDialogue(false);
  };
  return (
    <motion.div layout="position" layoutId={props.id}>
      <div className="flex gap-2 mr-8 items-end group">
        <div className="relative" ref={sideRef}>
          <div
            className={`bg-accent-a text-accent-c hover:bg-accent-b h-6 w-6 rounded-md flex items-center justify-center transition-opacity ${
              showAddDialogue
                ? "opacity-100"
                : "group-hover:opacity-100 opacity-0"
            }`}
            onClick={() => {
              setShowAddDialogue(!showAddDialogue);
            }}
          >
            <FiPlus className="w-4" />
          </div>

          <motion.div
            className="select-none top-0 left-6 z-10 absolute bg-white child:flex child:p-2 child:pr-4 child:gap-2 whitespace-nowrap p-2 text-mono-c font-os text-sm rounded-md shadow-sm border border-mono-border-light hover:child:bg-accent-c/10 child:rounded-md child:cursor-pointer child:items-center origin-top-left"
            animate={{
              opacity: showAddDialogue ? 1 : 0,
              scale: showAddDialogue ? 1 : 0,
            }}
            transition={{
              duration: 0.5,
              type: "spring",
              bounce: 0.25,
            }}
          >
            <div
              onClick={() => {
                addBlock("TEXT");
              }}
            >
              <IoText />
              <p>Add Text</p>
            </div>

            <div>
              <IoText />
              <p>Add Image</p>
            </div>

            <div>
              <IoText />
              <p>Add Divider</p>
            </div>
          </motion.div>
        </div>
        <div className="w-full">{props.children}</div>
      </div>
    </motion.div>
  );
}
