import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Tifo</h1>
      <nav>
        <ul>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/onboarding">Onboarding</Link></li>
        </ul>
      </nav>
    </main>
  );
}
