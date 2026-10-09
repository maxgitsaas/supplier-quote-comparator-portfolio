"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { ComparisonContext } from "../context/ComparisonContext";

import { useRouter } from "next/navigation";

export default function NewComparison() {
  // =========================
  // STATE
  // =========================

  const { setComparison } = useContext(ComparisonContext);

  // Overall comparison data
  const [comparisonName, setComparisonName] = useState("");

  // Temporary input values for a new requested item
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");

  // Items already added to the comparison
  const [requestedItems, setRequestedItems] = useState([]);

  // Validation messages
  const [itemError, setItemError] = useState("");
  const [formError, setFormError] = useState("");

  // Route user to another screen
  const router = useRouter();

  // =========================
  // REQUESTED ITEM HANDLERS
  // =========================

  // Validate the item inputs, create an item,
  // and add it to the requestedItems array.
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
    setFormError("");
  }

  // Remove the requested item at the selected array index.
  function handleRemoveItem(indexToRemove) {
    setRequestedItems((currentItems) =>
      currentItems.filter((_, index) => index !== indexToRemove),
    );
  }

  // =========================
  // FORM SUBMISSION
  // =========================

  // Validate the full comparison and build
  // the final comparison object.
  function handleSubmit(event) {
    event.preventDefault();

    if (comparisonName.trim() === "") {
      setFormError("Enter a comparison name.");
      return;
    }

    if (requestedItems.length === 0) {
      setFormError("Add at least one requested item.");
      return;
    }

    const newComparison = {
      name: comparisonName.trim(),
      items: requestedItems,
    };

    setComparison(newComparison);
    setFormError("");

    router.push("/comparison");
  }

  // =========================
  // PAGE UI
  // =========================

  return (
    <main className="page-new-comparison">
      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>

      <header className="page-header">
        <p className="page-header-label">Create</p>
        <h1>New Comparison</h1>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Comparison Details */}
        <section>
          <h2>Comparison Details</h2>

          <label>
            Comparison Name
            <input
              type="text"
              placeholder="e.g. Office Furniture"
              value={comparisonName}
              onChange={(event) => {
                setComparisonName(event.target.value);
                setFormError("");
              }}
            />
          </label>
        </section>

        <section>
          {/* Requested Items */}
          <h2>Requested Items</h2>

          <div>
            <label>
              Item Name
              <input
                type="text"
                placeholder="e.g. Office Chair"
                value={itemName}
                onChange={(event) => {
                  setItemName(event.target.value);
                  setItemError("");
                }}
              />
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                placeholder="e.g. 20"
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  setItemError("");
                }}
              />
            </label>
          </div>

          {/* Display Item Error */}
          {itemError && <p className="form-error">{itemError}</p>}

          <button
            type="button"
            className="button button-secondary"
            onClick={handleAddItem}
          >
            + Add Item
          </button>

          {/* Map Added Items Below */}
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

        {/* Display Form Error */}
        {formError && <p className="form-error">{formError}</p>}

        <button type="submit" className="button button-primary">
          Create Comparison
        </button>
      </form>
    </main>
  );
}
