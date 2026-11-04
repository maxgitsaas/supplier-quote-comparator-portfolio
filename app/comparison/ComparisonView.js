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
        <p className="page-header-label">Comparison</p>
        <h1>{comparison.name}</h1>
      </header>

      <section>
        {supplierQuotes.length === 0 ? (
          <div>
            <h2>Requested Items</h2>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {comparison.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {supplierQuotes.length === 0 ? (
        <section>
          <h2>Supplier Quotes</h2>

          <p>No supplier quotes added yet.</p>

          <Link
            href={`/supplier-quote?comparisonId=${comparison.id}`}
            className="button button-secondary"
          >
            + Add Supplier Quote
          </Link>
        </section>
      ) : (
        <Link
          href={`/supplier-quote?comparisonId=${comparison.id}`}
          className="button button-secondary page-action"
        >
          + Add Supplier Quote
        </Link>
      )}
    </main>
  );
}
