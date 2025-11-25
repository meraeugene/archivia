export function formatStudentYear(year: string | null | undefined) {
  if (!year) return "No Year";

  const y = parseInt(year);
  if (isNaN(y) || y <= 0) return "No Year";

  const suffix = (n: number) => {
    if (n % 100 >= 11 && n % 100 <= 13) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${y}${suffix(y)} Year`;
}
