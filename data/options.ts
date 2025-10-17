const categoryOptions = [
  { key: "all", label: "All" },
  { key: "AI", label: "Artificial Intelligence" },
  { key: "Education", label: "Education" },
  { key: "Health", label: "Health" },
  { key: "Business", label: "Business" },
];

const sortOptions = ["Relevance", "Date", "Title", "Author"] as const;

export { categoryOptions, sortOptions };
