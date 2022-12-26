import { IoAlertCircle, IoAlertCircleOutline } from "react-icons/io5/index.js";

import React from "react";

export default function ErrorLine(props: { children: string }) {
  return (
    <div className="flex gap-2 text-red-500 items-center">
      <IoAlertCircleOutline className="text-lg" />
      <p>{props.children}</p>
    </div>
  );
}
