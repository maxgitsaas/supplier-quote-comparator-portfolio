import Link from "next/link";
import ComparisonCard from "@/components/ComparisonCard";

const comparisons = [
  {
    id: 1,
    name: "Office Furniture",
    suppliers: 3,
    date: "September 8, 2026",
  },
];

export default function Home() {
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

      {comparisons.map((comparison) => (
        <ComparisonCard key={comparison.id} comparison={comparison} />
      ))}
    </main>
  );
}
