import { endAt } from "firebase/database";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NewsletterChangeOrderBar from "./NewsletterChangeOrderBar";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { motion } from "framer-motion";

import { crop } from "@cloudinary/url-gen/actions/resize";
import { Cloudinary } from "@cloudinary/url-gen";
import imageSize from "image-size";
import MetadataTextInput from "./MetadataTextInput";

export default function ImageEditor(props: {
  publicId: string;
  caption: string;
  alt: string;
  width: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  setPublicId: (publicId: string) => void;
  setCaption: (caption: string) => void;
  setAlt: (alt: string) => void;
  setWidth: (width: number) => void;
  setCrop: (crop?: Crop) => void;
}) {
  const [width, setWidth] = useState(props.width);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const [workingCrop, setWorkingCrop] = useState<Crop>();
  const [trueCrop, setTrueCrop] = useState<Crop | undefined>();
  const [cropUrl, setCropUrl] = useState<string>();

  const [caption, setCaption] = useState<string>(props.caption);
  const [alt, setAlt] = useState<string>(props.alt);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    props.setPublicId(props.publicId);
  }, [props.publicId]);

  useEffect(() => {
    props.setCaption(caption);
  }, [caption]);

  useEffect(() => {
    props.setAlt(alt);
  }, [alt]);

  useEffect(() => {
    props.setWidth(width);
  }, [width]);

  useEffect(() => {
    props.setCrop(trueCrop);
  }, [trueCrop]);

  useEffect(() => {
    if (dragging) {
      const initialWidth = width;
      let initialMouseX = -1;

      const onMouseMove = (e: MouseEvent) => {
        if (initialMouseX === -1) {
          initialMouseX = e.clientX - e.movementX;
        }

        setWidth(initialWidth - (initialMouseX - e.clientX));
      };

      window.addEventListener("mousemove", onMouseMove);

      const onMouseUp = (e: MouseEvent) => {
        setDragging(false);
      };

      window.addEventListener("mouseup", onMouseUp);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [dragging]);

  useEffect(() => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dlkexpc87",
      },
    });

    const image = cld.image(props.publicId);

    if (trueCrop && trueCrop.width > 0 && trueCrop.height > 0) {
      image.resize(
        crop()
          .width(Math.round(trueCrop.width))
          .height(Math.round(trueCrop.height))
          .x(Math.round(trueCrop.x))
          .y(Math.round(trueCrop.y))
      );
    }

    setCropUrl(image.toURL());
  }, [trueCrop]);

  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (imageRef.current && !imageRef.current.complete) {
      setImageLoading(true);

      const listener = () => {
        setImageLoading(false);
      };

      imageRef.current.addEventListener("load", listener);

      return () => {
        imageRef.current?.removeEventListener("load", listener);
      };
    } else {
      setImageLoading(false);
    }
  }, [cropUrl]);

  return (
    <div className="">
      <div className="relative mx-auto" style={{ width }}>
        <ReactCrop
          disabled={trueCrop != null}
          crop={workingCrop}
          onChange={setWorkingCrop}
        >
          <div
            className="relative select-none group min-h-[4rem] bg-mono-container-light"
            onMouseOver={() => {
              setHover(true);
            }}
            onMouseOut={() => {
              setHover(false);
            }}
          >
            <motion.div
              animate={{
                scale: imageLoading ? 0.5 : 1,
                opacity: imageLoading ? 0 : 1,
              }}
              initial={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: imageLoading ? 1 : 0.5,
                type: "spring",
                bounce: imageLoading ? 0 : 0.5,
              }}
            >
              <img src={cropUrl} alt={props.alt} width={width} ref={imageRef} />
            </motion.div>
            <div className="absolute top-2 left-2">
              <NewsletterChangeOrderBar
                show={hover}
                isFirst={props.isFirst}
                isLast={props.isLast}
                onMoveUp={props.onMoveUp}
                onMoveDown={props.onMoveDown}
                remove={props.onRemove}
              />
            </div>

            <div
              className={`absolute h-full w-1 bg-blue-400 right-0 top-0 transition-opacity ${
                dragging ? "" : "opacity-0 group-hover:opacity-100"
              }`}
              onMouseDown={(e) => {
                setDragging(true);
              }}
            ></div>
          </div>
        </ReactCrop>
        <div
          className={`absolute h-full w-8 cursor-ew-resize right-0 top-0 transition-opacity ${
            dragging ? "" : "opacity-0 group-hover:opacity-100"
          }`}
          onMouseDown={(e) => {
            setDragging(true);
          }}
        ></div>
        {(workingCrop && workingCrop.width !== 0 && workingCrop.height !== 0) ||
        trueCrop ? (
          <motion.div
            className="absolute bottom-4 left-2 bg-black/50 text-white py-1 px-2 rounded-md font-os text-sm z-20 cursor-pointer"
            onClick={() => {
              if (trueCrop) {
                setTrueCrop(undefined);
                return;
              } else if (workingCrop) {
                const multiplier =
                  (imageRef.current?.naturalWidth ?? 0) / width;

                setTrueCrop({
                  width: workingCrop.width * multiplier,
                  height: workingCrop.height * multiplier,
                  x: workingCrop.x * multiplier,
                  y: workingCrop.y * multiplier,
                  unit: "px",
                });

                setWorkingCrop(undefined);
              }
            }}
            initial={{
              opacity: 1,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            whileTap={{
              scale: 0.9,
            }}
          >
            {trueCrop != null ? "Reset" : "Transform"}
          </motion.div>
        ) : null}
      </div>
      <div style={{ width }} className="mx-auto">
        <MetadataTextInput
          label="Alt Text"
          value={alt}
          setValue={setAlt}
          placeholder="Enter a caption for this image."
        />
        <MetadataTextInput
          label="Caption"
          value={caption}
          setValue={setCaption}
          placeholder="Enter a caption for this image."
        />
      </div>
    </div>
  );
}
