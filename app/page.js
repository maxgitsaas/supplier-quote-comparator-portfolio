import ComparisonCard from "@/components/ComparisonCard";

const comparisons = [
  {
    id: 1,
    name: "Office Furniture",
    suppliers: 3,
    date: "September 8, 2026",
  },
  {
    id: 2,
    name: "New Laptops",
    suppliers: 2,
    date: "September 5, 2026",
  },
];

export default function Home() {
  return (
    <main>
      <h1>Supplier Quote Comparator</h1>
      <button>+ New Comparison</button>
      <h2>Your Comparisons</h2>

      {comparisons.map((comparison) => (
        <ComparisonCard key={comparison.id} comparison={comparison} />
      ))}
    </main>
  );
}
