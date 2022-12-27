// text input component with state and label
export default function Input(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  large?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-base text-slate-600 font-medium">{props.label}</p>
      {!props.large ? (
        <input
          autoComplete="off"
          type={"text"}
          className="p-2 border border-gray-300 rounded-md"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        />
      ) : (
        <textarea
          className="p-2 border border-gray-300 rounded-md h-32"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      )}
    </div>
  );
}
