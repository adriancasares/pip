import { endAt } from "firebase/database";
import React, { useEffect, useState } from "react";
import NewsletterChangeOrderBar from "./NewsletterChangeOrderBar";

export default function ImageEditor(props: {
  src: string;
  caption: string;
  alt: string;
  width: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const [width, setWidth] = useState(props.width);
  const [dragging, setDragging] = useState(false);

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

  const [hover, setHover] = useState(false);
  return (
    <div>
      <div
        className="relative select-none group"
        onMouseOver={() => {
          setHover(true);
        }}
        onMouseOut={() => {
          setHover(false);
        }}
      >
        <img src={props.src} alt={props.alt} width={width} />
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
          className={`absolute h-full w-8 cursor-ew-resize border-r-4 border-blue-400 right-0 top-0 transition-opacity ${
            dragging ? "" : "opacity-0 group-hover:opacity-100"
          }`}
          onMouseDown={(e) => {
            console.log("mouse down", e);

            setDragging(true);
          }}
        ></div>
      </div>
    </div>
  );
}
