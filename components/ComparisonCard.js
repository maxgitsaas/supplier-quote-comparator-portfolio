import Link from "next/link";

export default function ComparisonCard({ comparison }) {
  return (
    <div>
      <h3>{comparison.name}</h3>
      <p>{comparison.suppliers} supplier quotes</p>
      <p>{comparison.date}</p>

      <Link href="/comparison">View Comparison</Link>
    </div>
  );
}
