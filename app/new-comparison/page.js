export default function NewComparison() {
  return (
    <main>
      <h1>New Comparison</h1>

      <label>
        Comparison Name
        <input type="text" />
      </label>

      <h2>Items</h2>

      <div>
        <input type="text" placeholder="Item name" />
        <input type="number" placeholder="Quantity" />
      </div>

      <button>+ Add Item</button>

      <button>Create Comparison</button>
    </main>
  );
}
