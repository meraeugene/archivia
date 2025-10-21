export const submitThesisFields = [
  { key: "title", label: "Title", type: "text" },
  {
    key: "keywords",
    label: "Keywords (comma separated)",
    type: "text",
    isArray: true,
  },
  {
    key: "proponents",
    label: "Proponents (comma separated)",
    type: "text",
    isArray: true,
  },
  { key: "defense_year", label: "Defense Year", type: "number" },
  { key: "adviser_name", label: "Adviser Name", type: "text" },
  {
    key: "panel_chair_name",
    label: "Panel Chair Name",
    type: "text",
  },
  {
    key: "panel_members",
    label: "Panel Members (comma separated)",
    type: "text",
    isArray: true,
  },
  { key: "category", label: "Category", type: "text" },
];
