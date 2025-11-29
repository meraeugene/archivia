import { getSession } from "../auth/getSession";

export async function semanticSearchTheses(query: string) {
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
      )}`
    );
    // const res = await fetch(
    //   `http://localhost:8000/search?query=${encodeURIComponent(query)}`
    // );

    if (!res.ok) throw new Error("Semantic search failed");

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: err };
  }
}
