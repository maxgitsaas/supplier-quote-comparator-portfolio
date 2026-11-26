import { getComparisonColor } from "@/lib/comparison-colors";

export default function ComparisonHeader({ comparison, label }) {
  const accent = getComparisonColor(comparison.color)?.hex;

  return (
    <header
      className="page-header comparison-header"
      style={accent ? { "--comparison-accent": accent } : undefined}
    >
      <p className="page-header-label">{label}</p>
      <h1>Comparison: {comparison.name}</h1>
    </header>
  );
}
