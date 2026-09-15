"use client";
import { useState } from "react";
import Link from "next/link";

export default function NewComparison() {
  const [comparisonName, setComparisonName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requestedItems, setRequestedItems] = useState([]);

  function handleAddItem() {
    const newItem = {
      name: itemName,
      quantity: quantity,
    };

    setRequestedItems([...requestedItems, newItem]);

    setItemName("");
    setQuantity("");
  }

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
          <input
            type="text"
            placeholder="e.g. Office Furniture"
            value={comparisonName}
            onChange={(event) => setComparisonName(event.target.value)}
          />
        </label>
      </section>

      <section>
        <h2>Requested Items</h2>

        <div>
          <label>
            Item Name
            <input
              type="text"
              placeholder="e.g. Office Chair"
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
            />
          </label>

          <label>
            Quantity
            <input
              type="number"
              placeholder="e.g. 20"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
        </div>

        {requestedItems.map((item, index) => (
          <p key={index}>
            {item.name} — Quantity: {item.quantity}
          </p>
        ))}

        <button className="button button-secondary" onClick={handleAddItem}>
          + Add Item
        </button>
      </section>

      <button className="button button-primary">Create Comparison</button>
    </main>
  );
}
