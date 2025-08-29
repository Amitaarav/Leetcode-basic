export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchSubmissions() {

  const res = await fetch(`${API_BASE}/submissions`, {
    cache: "no-store",
    
  });

  if (!res.ok) {
    throw new Error("Failed to fetch submissions");
  }

  return res.json();
}
