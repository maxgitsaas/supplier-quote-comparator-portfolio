import Link from "next/link";

export default function NewComparison() {
  return (
    <main>
      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>

      <h1>New Comparison</h1>

      <section>
        <h2>Comparison Details</h2>

        <label>
          Comparison Name
          <input type="text" placeholder="e.g. Office Furniture" />
        </label>
      </section>

      <section>
        <h2>Requested Items</h2>

        <div>
          <label>
            Item Name
            <input type="text" placeholder="e.g. Office Chair" />
          </label>

          <label>
            Quantity
            <input type="number" placeholder="e.g. 20" />
          </label>
        </div>

        <button className="button button-secondary">+ Add Item</button>
      </section>

      <button className="button button-primary">Create Comparison</button>
    </main>
  );
}
