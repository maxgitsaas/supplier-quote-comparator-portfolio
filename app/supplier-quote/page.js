import Link from "next/link";
import QuoteItemCard from "@/components/QuoteItemCard";

const items = [
  {
    id: 1,
    name: "Office Chair",
    quantity: 20,
  },
  {
    id: 2,
    name: "Standing Desk",
    quantity: 10,
  },
  {
    id: 3,
    name: "Monitor Arm",
    quantity: 20,
  },
];

export default function SupplierQuote() {
  return (
    <main className="page-supplier-quote">
      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>

      <header className="page-header">
        <p className="page-header-label">Enter Quote</p>
        <h1>Supplier Quote</h1>
      </header>

      <p>Comparison: Office Furniture</p>

      <Link href="/comparison" className="button button-context page-action">
        ← Back to Comparison
      </Link>

      <section>
        <h2>Supplier Details</h2>

        <div>
          <label>
            Supplier Name
            <input type="text" placeholder="e.g. Acme Office Supplies" />
          </label>

          <label>
            Delivery Cost
            <input type="number" placeholder="e.g. 120" />
          </label>

          <label>
            Lead Time
            <input type="text" placeholder="e.g. 7 days" />
          </label>
        </div>
      </section>

      <section>
        <h2>Quoted Items</h2>

        {items.map((item) => (
          <QuoteItemCard key={item.id} item={item} />
        ))}
      </section>

      <button className="button button-primary">Save Quote</button>
    </main>
  );
}
