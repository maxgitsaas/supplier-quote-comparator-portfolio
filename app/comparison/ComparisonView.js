import Link from "next/link";
import { Prisma } from "@/generated/prisma/client";

export default function ComparisonView({ comparison }) {
  const supplierQuotes = comparison.quotes;

  // Helper function for ID-based matching
  function getQuotedItem(quote, comparisonItemId) {
    const quotedItem = quote.quoteItems.find(
      (item) => item.comparisonItemId === comparisonItemId,
    );

    if (!quotedItem) {
      throw new Error("Matching quote item not found.");
    }

    return quotedItem;
  }

  function calculateItemsTotal(quote) {
    return comparison.items.reduce((total, item) => {
      const quotedItem = getQuotedItem(quote, item.id);

      return total.plus(quotedItem.unitPrice.times(item.quantity));
    }, new Prisma.Decimal(0));
  }

  return (
    <main className="page-comparison">
      {/* 1. Navigation */}
      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>

      {/* 2. Page heading */}
      <header className="page-header">
        <p className="page-header-label">Comparison View</p>
        <h1>Comparison: {comparison.name}</h1>
      </header>

      {/* 3. Main content */}
      <section>
        {supplierQuotes.length === 0 ? (
          // CASE 1: No supplier quotes exist
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
                {comparison.items.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          // CASE 2: Supplier quotes exist
          <table>
            <thead>
              <tr>
                <th>Item</th>
                {supplierQuotes.map((quote) => {
                  return <th key={quote.id}>{quote.supplierName}</th>;
                })}
              </tr>
            </thead>

            <tbody>
              {comparison.items.map((item) => {
                return (
                  <tr key={item.id}>
                    <th>
                      {item.name}
                      <br />
                      Quantity: {item.quantity}
                    </th>

                    {supplierQuotes.map((quote) => {
                      const quotedItem = getQuotedItem(quote, item.id);
                      return (
                        <td key={quote.id}>
                          €{quotedItem.unitPrice.toFixed(2)}
                          <br />
                          Subtotal: €
                          {quotedItem.unitPrice.times(item.quantity).toFixed(2)}
                          <br />
                          {quotedItem.availability}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <th>Items Total</th>
                {supplierQuotes.map((quote) => {
                  return (
                    <td key={quote.id}>
                      €{calculateItemsTotal(quote).toFixed(2)}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <th>Delivery</th>
                {supplierQuotes.map((quote) => {
                  return (
                    <td key={quote.id}>
                      €{quote.deliveryCost.toFixed(2)}
                    </td>
                  );
                })}
              </tr>

              <tr className="total-row">
                <th>Total</th>
                {supplierQuotes.map((quote) => {
                  return (
                    <td key={quote.id}>
                      €
                      {calculateItemsTotal(quote).plus(quote.deliveryCost).toFixed(2)}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <th>Lead Time</th>
                {supplierQuotes.map((quote) => {
                  const leadTime = /^\d+$/.test(quote.leadTime)
                    ? `${quote.leadTime} days`
                    : quote.leadTime;
                  return <td key={quote.id}>{leadTime}</td>;
                })}
              </tr>
            </tbody>
          </table>
        )}
      </section>

      {/* 4. Supplier Quote navigation */}
      {supplierQuotes.length === 0 ? (
        <section>
          <h2>Supplier Quotes</h2>
          <p>No supplier quotes added yet.</p>

          <Link
            href={`/supplier-quote?comparisonId=${comparison.id}`}
            className="button button-secondary"
          >
            Add Supplier Quote
          </Link>
        </section>
      ) : (
        <Link
          href={`/supplier-quote?comparisonId=${comparison.id}`}
          className="button button-secondary page-action"
        >
          Add Supplier Quote
        </Link>
      )}
    </main>
  );
}
