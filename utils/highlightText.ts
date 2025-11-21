export const highlightText = (text: string, query?: string) => {
  if (!query || !text) return text;
  const words = query.trim().split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${words.join("|")})`, "gi");
  return text.replace(regex, "<mark class='bg-yellow-300'>$1</mark>");
};
