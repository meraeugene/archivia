import { getSession } from "./auth";

export async function getRecommendedAdvisers(title: string, abstract: string) {
  const session = await getSession();

  try {
    const res = await fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, abstract, student_id: session?.sub }),
      cache: "no-store",
    });

    // const res = await fetch(
    //   "https://web-production-9ba9.up.railway.app/recommend",
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ title, abstract, student_id: session?.sub }),
    //     cache: "no-store",
    //   }
    // );

    if (!res.ok) {
      const err = await res.text();
      console.error("FastAPI error:", err);
      return { error: err };
    }

    const data = await res.json();
    return {
      recommendations: data.recommendations,
      recommended_adviser_ids: data.recommended_adviser_ids,
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return { error: "Server connection failed." };
  }
}
