const page = () => {
  return (
    <div>
      <div className="flex items-center gap-5">
        <span className="text-sm">Sort by:</span>
        {/* <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as (typeof sortOptions)[number])
          }
          className="px-3 py-2 border border-gray-200 cursor-pointer hover:bg-gray-50 rounded-md  text-sm bg-white focus:outline-none "
        >
          {sortOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select> */}
      </div>{" "}
    </div>
  );
};

export default page;
