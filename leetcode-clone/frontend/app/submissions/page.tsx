import { fetchSubmissions } from "../../lib/api";

export default async function SubmissionsPage() {
  const submissions = await fetchSubmissions();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>
      <ul className="space-y-2">
        {submissions.map((s: any) => (
          <li key={s.id} className="p-4 rounded-lg border bg-gray-50">
            <p className="font-semibold">User: {s.user}</p>
            <p>Status: {s.status}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
