import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4 p-4 bg-blue-600 text-white">
      <Link href="/">Home</Link>
      <Link href="/submissions">Submissions</Link>
    </nav>
  );
}
