import Link from "next/link";
import { connection } from "next/server";
import ComparisonCard from "@/components/ComparisonCard";
import prisma from "@/lib/prisma";

export default async function Home() {
  await connection();
  const comparisons = await prisma.comparison.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      name: true,
      color: true,
      _count: { select: { items: true, quotes: true } },
    },
  });

  return (
    <main className="page-dashboard">
      <header className="page-header">
        <p className="page-header-label">Dashboard</p>
        <h1>Supplier Quote Comparator</h1>
      </header>

      <Link href="/new-comparison" className="button button-primary">
        + New Comparison
      </Link>

      <h2>Your Comparisons</h2>

      {comparisons.length > 0 ? (
        comparisons.map(({ id, name, color, _count }) => (
          <ComparisonCard
            key={id}
            comparison={{
              id,
              name,
              color,
              items: _count.items,
              suppliers: _count.quotes,
            }}
          />
        ))
      ) : (
        <p className="status-message">No comparison has been created yet.</p>
      )}
    </main>
  );
}
