export const isValidText = (text: string) => {
  const cleaned = text.trim();

  // 1. At least 10 characters
  if (cleaned.length < 10) return false;

  // 2. At least 2 words
  const words = cleaned.split(/\s+/);
  if (words.length < 2) return false;

  // 3. At least 1 words with length >= 5
  const longWords = words.filter((w) => w.length >= 5);
  if (longWords.length < 1) return false;

  // 4. Must contain at least one vowel (avoid "bcdfgh")
  if (!/[aeiou]/i.test(cleaned)) return false;

  // 5. Reject if too repetitive (e.g., "aaaaa aaaaa aaaaa")
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  if (uniqueWords.size < Math.ceil(words.length / 2)) return false;

  // 6. Must contain at least one space (multi-word phrase)
  if (!/\s/.test(cleaned)) return false;

  return true;
};
