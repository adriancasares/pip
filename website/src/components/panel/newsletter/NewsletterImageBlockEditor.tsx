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
      props.onChange({
        type: "IMAGE",
        caption,
        alt,
        width,
        publicId,
        crop,
        id: props.block.id,
      });
    } else {
      props.onChange({
        type: "IMAGE",
        caption,
        alt,
        width,
        publicId,
        id: props.block.id,
      });
    }
  }, [caption, alt, width, publicId, crop]);

  return (
    <div className="mx-auto relative">
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
        </div>
      ) : (
        <div className="mx-auto w-fit">
          <div
            className="relative w-fit ml-4"
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
