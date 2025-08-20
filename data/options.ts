const filterOptions = [
  { key: "all", label: "All Fields" },
  { key: "computer-science", label: "Computer Science" },
  { key: "psychology", label: "Psychology" },
  { key: "engineering", label: "Engineering" },
  { key: "business", label: "Business" },
  { key: "literature", label: "Literature" },
];

const sortOptions = ["Relevance", "Date", "Title", "Author"] as const;

export { filterOptions, sortOptions };
