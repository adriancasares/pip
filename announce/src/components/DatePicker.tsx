import Button from "./Button";

// Date picker
export default function DatePicker(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-base text-slate-600 font-medium">{props.label}</p>
      <div className="flex gap-2">
        <input
          className="p-2 border border-gray-300 rounded-md"
          type="date"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
        <Button
          label="Next Wedensday"
          onClick={() => {
            const today = new Date();
            const nextWednesday = new Date(today);
            nextWednesday.setDate(
              today.getDate() + ((3 + 7 - today.getDay()) % 7)
            );
            props.onChange(nextWednesday.toISOString().split("T")[0]);
          }}
        />
      </div>
    </div>
  );
}
