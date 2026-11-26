import Link from "next/link";

export default function ComparisonCard({ comparison }) {
  return (
    <div>
      <h3>{comparison.name}</h3>

      <p>{comparison.items} items</p>
      <p>{comparison.suppliers} supplier quotes</p>

      <Link
        href={`/comparison?id=${comparison.id}`}
        className="button button-secondary"
      >
        View Comparison
      </Link>
    </div>
  );
}
