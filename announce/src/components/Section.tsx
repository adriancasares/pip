import { IoReturnDownBackOutline } from "react-icons/io5/index.js";
import Button from "./Button";

export default function Section(props: {
  children: React.ReactNode;
  label: string;
  index: number;
  reset?: () => void;
}) {
  return (
    <div className="bg-slate-100 p-4 rounded-lg max-w-4xl w-full">
      <div className="flex justify-between items-center border-b border-b-slate-300 pb-4 mb-4">
        <div className="flex gap-4 items-center">
          <div className="bg-yellow-500 text-white h-10 w-10 flex items-center justify-center rounded-lg">
            <span className="text-2xl font-semibold">{props.index}</span>
          </div>
          <h2 className="text-2xl font-semibold">{props.label}</h2>
        </div>
        {props.reset && (
          <button
            className="bg-blue-600 text-white w-10 h-10 rounded-md flex items-center justify-center"
            onClick={props.reset}
          >
            <IoReturnDownBackOutline />
          </button>
        )}
      </div>
      <div>{props.children}</div>
    </div>
  );
}
