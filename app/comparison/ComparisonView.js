import Link from "next/link";
import ComparisonHeader from "@/components/ComparisonHeader";
import { Prisma } from "@/generated/prisma/client";
import { formatDays, getQuoteLeadTimeDays } from "@/lib/lead-time";
import ComparisonColorPicker from "./ComparisonColorPicker";
import styles from "./ComparisonView.module.css";

function summarizeLeadTimes(offers) {
  const [shortest, next] = offers
    .filter(({ leadTimeDays }) => leadTimeDays !== null)
    .sort((a, b) => a.leadTimeDays - b.leadTimeDays);

  if (!shortest) return "No lead times in days to compare.";

  const duration = formatDays(shortest.leadTimeDays);
  if (!next) return `Only ${shortest.quote.supplierName} quotes a lead time in days (${duration}).`;

  const difference = next.leadTimeDays - shortest.leadTimeDays;
  if (difference === 0) return `Multiple suppliers tie for the shortest quoted lead time of ${duration}.`;

  return `${shortest.quote.supplierName} has the shortest quoted lead time at ${duration}, ${formatDays(difference)} shorter than ${next.quote.supplierName} (${formatDays(next.leadTimeDays)}).`;
}

function DecisionSummary({ offers }) {
  if (offers.length < 2) return null;

  const [lowest, next] = [...offers].sort((a, b) => a.total.comparedTo(b.total));
  const savings = next.total.minus(lowest.total);
  const priceComparison = savings.eq(0)
    ? "Multiple suppliers tie for the lowest total."
    : `${lowest.quote.supplierName} saves €${savings.toFixed(2)} vs. the next-lowest offer.`;

  return (
    <aside className={styles.decisionSummary} aria-label="Decision summary">
      <h2>Decision summary</h2>
      <p className={styles.summaryPrice}>{priceComparison}</p>
      <p>{summarizeLeadTimes(offers)}</p>
    </aside>
  );
}

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

  const offers = supplierQuotes.map((quote) => {
    const itemsTotal = calculateItemsTotal(quote);
    return {
      quote,
      itemsTotal,
      total: itemsTotal.plus(quote.deliveryCost).toDecimalPlaces(2),
      leadTimeDays: getQuoteLeadTimeDays(quote),
    };
  });

  return (
    <main className="page-comparison">
      {/* 1. Navigation */}
      <nav className={styles.toolbar} aria-label="Comparison actions">
        <Link href="/" className="back-dashboard">
          ← Back to Dashboard
        </Link>
        <ComparisonColorPicker
          key={comparison.id}
          comparisonId={comparison.id}
          color={comparison.color}
        />
      </nav>

      {/* 2. Page heading */}
      <ComparisonHeader comparison={comparison} label="Comparison View" />

      {/* 3. Main content */}
      <section>
        {supplierQuotes.length === 0 ? (
          // CASE 1: No supplier quotes exist
          <div>
            <h2>Requested Items</h2>

            <table className={styles.comparisonTable}>
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
          <div className={styles.tablePanel}>
            <DecisionSummary offers={offers} />
            <label className={styles.detailsToggle}>
              <input type="checkbox" role="switch" aria-controls="comparison-quote-table" />
              Toggle item details
            </label>
            <div className={styles.tableScroll} role="region" aria-label="Supplier quote table" tabIndex={0}>
              <table id="comparison-quote-table"
                className={`${styles.comparisonTable} ${styles.quoteTable}`}
                style={{ minWidth: `${Math.max(30, (offers.length + 1) * 10)}rem` }}>
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
                      <tr key={item.id} className={styles.itemRow}>
                        <th scope="row">
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.quantity}>Quantity: {item.quantity}</span>
                        </th>

                        {supplierQuotes.map((quote) => {
                          const quotedItem = getQuotedItem(quote, item.id);
                          return (
                            <td key={quote.id} className={styles.itemQuote}>
                              <span className={styles.lineTotal}>
                                €{quotedItem.unitPrice.times(item.quantity).toFixed(2)}
                              </span>
                              <span className={styles.unitPrice}>
                                €{quotedItem.unitPrice.toFixed(2)} per unit
                              </span>
                              <span className={styles.availability}>
                                {quotedItem.availability}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  <tr>
                    <th scope="row">Items Total</th>
                    {offers.map(({ quote, itemsTotal }) => {
                      return (
                        <td key={quote.id}>
                          €{itemsTotal.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <th scope="row">Delivery</th>
                    {supplierQuotes.map((quote) => {
                      return (
                        <td key={quote.id}>
                          €{quote.deliveryCost.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="total-row">
                    <th scope="row">Total</th>
                    {offers.map(({ quote, total }) => {
                      return (
                        <td key={quote.id}>
                          €
                          {total.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <th scope="row">Lead time</th>
                    {offers.map(({ quote, leadTimeDays }) => (
                      <td key={quote.id}>
                        {leadTimeDays === null ? quote.leadTime?.trim() || "Not provided" : formatDays(leadTimeDays)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
