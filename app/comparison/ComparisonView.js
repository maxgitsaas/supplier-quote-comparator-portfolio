"use client";

import { useContext } from "react";
import Link from "next/link";
import { ComparisonContext } from "../context/ComparisonContext";

export default function ComparisonView({ comparison }) {
  const { supplierQuotes } = useContext(ComparisonContext);

  function calculateItemsTotal(quote) {
    return comparison.items.reduce((total, item, index) => {
      const unitPrice = Number(quote.items[index].unitPrice);
      const quantity = Number(item.quantity);

      return total + unitPrice * quantity;
    }, 0);
  }

  return (
    <main className="page-comparison">
      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>

      <header className="page-header">
        <p className="page-header-label">Compare</p>
        <h1>{comparison.name}</h1>
      </header>

      <Link
        href={`/supplier-quote?comparisonId=${comparison.id}`}
        className="button button-secondary page-action"
      >
        + Add Supplier Quote
      </Link>

      <section>
        <h2>Supplier Comparison</h2>

        {supplierQuotes.length === 0 ? (
          <p className="status-message">No supplier quotes added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item</th>

                {supplierQuotes.map((quote, index) => (
                  <th key={index}>{quote.supplierName}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {comparison.items.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  <th>
                    {item.name}
                    <br />
                    Quantity: {item.quantity}
                  </th>

                  {supplierQuotes.map((quote, quoteIndex) => (
                    <td key={quoteIndex}>
                      €{quote.items[itemIndex].unitPrice}
                      <br />
                      Subtotal: €
                      {(
                        Number(item.quantity) *
                        Number(quote.items[itemIndex].unitPrice)
                      ).toFixed(2)}
                      <br />
                      {quote.items[itemIndex].availability}
                    </td>
                  ))}
                </tr>
              ))}

              <tr>
                <th>Items Total</th>

                {supplierQuotes.map((quote, index) => (
                  <td key={index}>€{calculateItemsTotal(quote).toFixed(2)}</td>
                ))}
              </tr>

              <tr>
                <th>Delivery</th>

                {supplierQuotes.map((quote, index) => (
                  <td key={index}>€{quote.deliveryCost}</td>
                ))}
              </tr>

              <tr className="total-row">
                <th>Total</th>

                {supplierQuotes.map((quote, index) => (
                  <td key={index}>
                    €
                    {(
                      calculateItemsTotal(quote) + Number(quote.deliveryCost)
                    ).toFixed(2)}
                  </td>
                ))}
              </tr>

              <tr>
                <th>Lead Time</th>

                {supplierQuotes.map((quote, index) => (
                  <td key={index}>{quote.leadTime} days</td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
