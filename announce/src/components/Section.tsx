export default function Section(props: {
  children: React.ReactNode;
  label: string;
  index: number;
}) {
  return (
    <div className="bg-slate-100 p-4 rounded-lg max-w-4xl w-full">
      <div className="flex gap-4 items-center border-b border-b-slate-300 pb-4 mb-4">
        <div className="bg-yellow-500 text-white h-10 w-10 flex items-center justify-center rounded-lg">
          <span className="text-2xl font-semibold">{props.index}</span>
        </div>
        <h2 className="text-2xl font-semibold">{props.label}</h2>
      </div>
      <div>{props.children}</div>
    </div>
  );
}
