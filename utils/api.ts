// utils/api.ts
export async function fetchAdviserRecommendations(
  title: string,
  abstract: string
) {
  const res = await fetch("http://localhost:8000/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, abstract }),
  });
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}
