import { getSession } from "../auth/getSession";

export async function semanticSearchTheses(query: string, page = 1) {
  if (!query) {
    return { data: [], error: null };
  }

  const session = await getSession();

  if (!session) {
    return { data: null, error: "User not authenticated." };
  }

  try {
    const res = await fetch(
      `https://web-production-6b29d.up.railway.app/search?query=${encodeURIComponent(
        query
      )}&page=${page}`
    );

    // const res = await fetch(
    //   `http://localhost:8000/search?query=${encodeURIComponent(
    //     query
    //   )}&page=${page}`
    // );

    if (!res.ok) {
      console.error("Semantic search request failed:", res.statusText);
      throw new Error("Semantic search failed");
    }

    const json = await res.json();
    return { data: json.data, total: json.total, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: err };
  }
}
