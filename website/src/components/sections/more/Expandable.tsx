import { AnimatePresence, motion } from "framer-motion";
import { IoClose, IoCloseOutline } from "react-icons/io5/index.js";

export default function Expandable(props: {
  selection: number;
  setSelection: (selection: number) => void;
  index: number;
  label: string;
  setComponent: (component: JSX.Element) => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  const {
    selection,
    setSelection,
    index,
    label,
    setComponent,
    children,
    icon,
  } = props;

  const selected = selection === index;

  const component = (
    <motion.div
      layout="position"
      layoutId={`expandable-${index}`}
      className="p-4 bg-section-bg-purple max-w-4xl mx-auto rounded-2xl w-full overflow-hidden"
    >
      <div className="flex justify-between items-center">
        <motion.h2 className="text-mono-a text-xl font-title">
          {label}
        </motion.h2>
        <div
          className="text-mono-a text-2xl bg-section-bg-purple-lighter w-fit p-2 rounded-md cursor-pointer hover:opacity-50"
          onClick={() => {
            setSelection(-1);
            setComponent(<></>);
          }}
        >
          <IoCloseOutline />
        </div>
      </div>
      <div>{children}</div>
    </motion.div>
  );

  return (
    <motion.div
      animate={selection === -1 || selected ? "show" : "hide"}
      variants={{
        show: {
          opacity: 1,
        },
        hide: {
          opacity: 0,
        },
      }}
    >
      <motion.div
        layout="position"
        layoutId={`expandable-${index}`}
        className="py-4 px-8 rounded-full bg-section-bg-purple/75 text-mono-a w-fit select-none cursor-pointer hover:bg-section-bg-purple"
        onClick={() => {
          setComponent(component);
          setSelection(index);
        }}
      >
        <motion.span
          className={`${
            selected ? "hidden" : ""
          } w-fit flex items-center gap-4`}
        >
          {icon && <span className="text-2xl">{icon}</span>}
          <span>{label}</span>
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
