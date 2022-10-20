export default function MeetingTag(props: { children: string }) {
  return (
    <div className="text-sm py-1 px-3 rounded-full bg-mono-text-dark text-mono-b">
      {props.children}
    </div>
  );
}
