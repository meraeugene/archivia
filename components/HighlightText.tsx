interface HighlightProps {
  text: string;
  query?: string;
  className?: string;
}

const HighlightText: React.FC<HighlightProps> = ({
  text,
  query,
  className,
}) => {
  if (!query) return <>{text}</>;

  // Split the text on the query (case-insensitive)
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={index}
            className={`bg-yellow-200 px-1 rounded ${className || ""}`}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};
export default HighlightText;
