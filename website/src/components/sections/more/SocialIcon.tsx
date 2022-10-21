export default function SocialIcon(props: {
  children: React.ReactNode;
  link: string;
}) {
  return (
    <a href={props.link} target="_blank" rel="noreferrer">
      <div className="h-10 w-10 flex items-center justify-center text-mono-a bg-mono-text-dark rounded-full">
        {props.children}
      </div>
    </a>
  );
}
