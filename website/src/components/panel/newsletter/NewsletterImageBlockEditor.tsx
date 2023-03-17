import React, { useEffect, useMemo, useState } from "react";
import type { NewsletterImageBlock } from "../../../types/NewsletterContentBlock";
import NewsletterChangeOrderBar from "./NewsletterChangeOrderBar";
import { motion } from "framer-motion";
import TextInput from "../TextInput";
import ImageEditor from "./ImageEditor";
import type { Crop } from "react-image-crop";

export default function NewsletterImageBlockEditor(props: {
  block: NewsletterImageBlock;
  onChange: (newBlock: NewsletterImageBlock) => void;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const [publicId, setPublicId] = useState<string | undefined>(
    props.block.publicId
  );

  const widget = useMemo(() => {
    // @ts-ignore
    const w = window["cloudinary"].createUploadWidget(
      {
        cloudName: "dlkexpc87",
        uploadPreset: "newsletter",
      },
      (error: any, result: any) => {
        if (result.event === "success") {
          console.log(result);

          setPublicId(result.info.public_id);
          props.onChange({ ...props.block, publicId });
        }
      }
    );
    return w;
  }, []);

  const [hover, setHover] = useState(false);

  const [caption, setCaption] = useState<string>(props.block.caption ?? "");
  const [alt, setAlt] = useState<string>(props.block.alt ?? "");
  const [width, setWidth] = useState<number>(props.block.width ?? 250);

  const [crop, setCrop] = useState<Crop | undefined>(
    props.block.crop
      ? {
          x: props.block.crop.x,
          y: props.block.crop.y,
          width: props.block.crop.width,
          height: props.block.crop.height,
          unit: "px",
        }
      : undefined
  );

  useEffect(() => {
    if (crop) {
      props.onChange({ type: "IMAGE", caption, alt, width, publicId, crop });
    } else {
      props.onChange({ type: "IMAGE", caption, alt, width, publicId });
    }
  }, [caption, alt, width, publicId, crop]);

  return (
    <div className="mx-auto">
      {publicId ? (
        <div
          className="relative group"
          onMouseOver={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          <ImageEditor
            publicId={publicId}
            caption={caption}
            alt={alt}
            width={width}
            isFirst={props.isFirst}
            isLast={props.isLast}
            onMoveUp={props.onMoveUp}
            onMoveDown={props.onMoveDown}
            onRemove={props.onRemove}
            setWidth={setWidth}
            setCaption={setCaption}
            setAlt={setAlt}
            setCrop={setCrop}
            setPublicId={setPublicId}
          />
          {/* <div className="absolute top-4 left-4 z-20">
            <div className="flex flex-col gap-4">
              <NewsletterChangeOrderBar
                show={hover}
                isFirst={props.isFirst}
                isLast={props.isLast}
                onMoveUp={props.onMoveUp}
                onMoveDown={props.onMoveDown}
                remove={props.onRemove}
              />
              <motion.div
                className="p-2 flex flex-col bg-white rounded-xl shadow-sm border border-mono-border-light overflow-hidden w-fit z-20 child:cursor-pointer"
                style={{}}
                animate={{
                  opacity: hover ? 1 : 0,
                  scale: hover ? 1 : 0.9,
                }}
                transition={{
                  duration: hover ? 0.3 : 0,
                }}
              >
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={width}
                  onChange={(e) => {
                    setWidth(parseInt(e.target.value));
                  }}
                />
              </motion.div>
              <motion.div
                className="child:p-2 flex flex-col bg-white rounded-xl shadow-sm border border-mono-border-light overflow-hidden w-fit z-20 child:cursor-pointer"
                style={{}}
                animate={{
                  opacity: hover ? 1 : 0,
                  scale: hover ? 1 : 0.9,
                }}
                transition={{
                  duration: hover ? 0.3 : 0,
                }}
              >
                <TextInput
                  label="Alternative Text"
                  value={alt}
                  onChange={setAlt}
                  smallLabel
                />

                <TextInput
                  label="Caption"
                  value={caption}
                  onChange={setCaption}
                  smallLabel
                />
              </motion.div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-sky-500 opacity-0 group-hover:opacity-50 cursor-pointer"></div>
          <img src={src} width={displayWidth} /> */}
        </div>
      ) : (
        <div className="ml-4">
          <div
            className="relative"
            onMouseOver={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
          >
            <div className="absolute left-full top-1/2 -translate-y-1/2">
              <NewsletterChangeOrderBar
                show={hover}
                isFirst={props.isFirst}
                isLast={props.isLast}
                onMoveUp={props.onMoveUp}
                onMoveDown={props.onMoveDown}
                remove={props.onRemove}
              />
            </div>
            <button
              className="bg-indigo-500 text-white py-2 px-4 rounded-md mr-4"
              onClick={() => {
                widget.open();
              }}
            >
              Upload Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
