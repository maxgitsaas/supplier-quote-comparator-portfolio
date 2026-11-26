import Link from "next/link";
import { getComparisonColor } from "@/lib/comparison-colors";

export default function ComparisonCard({ comparison }) {
  const color = getComparisonColor(comparison.color);

  return (
    <div>
      <h3>{comparison.name}</h3>

      {color && (
        <span
          className="comparison-card-color"
          style={{ backgroundColor: color.hex }}
          role="img"
          aria-label={`Comparison color: ${color.label}`}
        />
      )}

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
