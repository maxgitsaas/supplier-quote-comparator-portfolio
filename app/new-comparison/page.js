"use client";
import { useState } from "react";
import Link from "next/link";

export default function NewComparison() {
  const [comparisonName, setComparisonName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requestedItems, setRequestedItems] = useState([]);
  const [itemError, setItemError] = useState("");

  //ADD ITEM FUNCTION
  function handleAddItem() {
    if (itemName.trim() === "" || Number(quantity) <= 0) {
      setItemError("Enter an item name and a quantity greater than zero.");
      return;
    }

    const newItem = {
      name: itemName.trim(),
      quantity: Number(quantity),
    };

    setRequestedItems([...requestedItems, newItem]);

    setItemName("");
    setQuantity("");
    setItemError("");
  }

  //REMOVE ITEM FUNCTION
  function handleRemoveItem(indexToRemove) {
    setRequestedItems((currentItems) =>
      currentItems.filter((_, index) => index !== indexToRemove),
    );
  }

  return (
    <main className="page-new-comparison">
      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>

      <header className="page-header">
        <p className="page-header-label">Create</p>
        <h1>New Comparison</h1>
      </header>

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

        {itemError && <p className="form-error">{itemError}</p>}

        <button
          type="button"
          className="button button-secondary"
          onClick={handleAddItem}
        >
          + Add Item
        </button>

        {requestedItems.map((item, index) => (
          <div key={index}>
            <p>
              {item.name} — Quantity: {item.quantity}
            </p>

            <button
              type="button"
              className="button button-secondary"
              onClick={() => handleRemoveItem(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <button className="button button-primary">Create Comparison</button>
    </main>
  );
}
