import Link from "next/link";
import { Prisma } from "@/generated/prisma/client";
import ComparisonColorPicker from "./ComparisonColorPicker";
import styles from "./ComparisonView.module.css";

function formatPrice(amount) {
  return `€${amount.toFixed(2)}`;
}

function getQuoteDetails(quote, items) {
  const quotedItems = new Map(
    quote.quoteItems.map((item) => [item.comparisonItemId, item]),
  );
  const lines = new Map();
  let itemsTotal = new Prisma.Decimal(0);

  for (const item of items) {
    const quotedItem = quotedItems.get(item.id);
    if (!quotedItem) throw new Error("Matching quote item not found.");

    const lineTotal = quotedItem.unitPrice.times(item.quantity);
    lines.set(item.id, {
      unitPrice: quotedItem.unitPrice,
      availability: quotedItem.availability,
      lineTotal,
    });
    itemsTotal = itemsTotal.plus(lineTotal);
  }

  const days = /^\d+$/.test(quote.leadTime) ? Number(quote.leadTime) : null;
  const leadDays = Number.isSafeInteger(days) ? days : null;

  return {
    id: quote.id,
    supplierName: quote.supplierName,
    deliveryCost: quote.deliveryCost,
    leadTime: leadDays === null
      ? quote.leadTime
      : `${leadDays} ${leadDays === 1 ? "day" : "days"}`,
    leadDays,
    lines,
    itemsTotal,
    total: itemsTotal.plus(quote.deliveryCost).toDecimalPlaces(2),
  };
}

function QuoteTable({ items, quotes }) {
  const suppliers = quotes.map((quote) => getQuoteDetails(quote, items));
  const lowestTotal = Prisma.Decimal.min(...suppliers.map((supplier) => supplier.total));
  const showLowest = suppliers.some((supplier) => supplier.total.gt(lowestTotal));
  const numericLeadTimes = suppliers.flatMap(({ leadDays }) =>
    leadDays === null ? [] : [leadDays],
  );
  const fastest = Math.min(...numericLeadTimes);
  const showFastest =
    numericLeadTimes.length === suppliers.length &&
    numericLeadTimes.some((days) => days > fastest);

  return (
    <section className={styles.quoteSection} aria-label="Supplier quotes">
      <div
        className={styles.scrollRegion}
        role="region"
        aria-label="Scrollable supplier quotes"
        tabIndex={0}
      >
        <table className={styles.quoteTable}>
          <thead>
            <tr>
              <th scope="col" className={styles.itemColumn}>Requested item</th>
              {suppliers.map((supplier) => (
                <th
                  scope="col"
                  key={supplier.id}
                  aria-label={supplier.supplierName}
                  className={styles.supplierColumn}
                >
                  <span className={styles.supplierName}>{supplier.supplierName}</span>
                  <span className={styles.summaryTotal}>{formatPrice(supplier.total)}</span>
                  <span className={styles.summaryDetail}>
                    Total incl. delivery
                    {showLowest && supplier.total.eq(lowestTotal) && (
                      <>
                        {" "}
                        <span className={styles.lowest}>Lowest total</span>
                      </>
                    )}
                  </span>
                  <span className={styles.leadTime}>
                    Lead time: {supplier.leadTime}
                    {showFastest && supplier.leadDays === fastest && (
                      <>
                        {" "}
                        <span className={styles.fastest}>Fastest</span>
                      </>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <th scope="row" className={styles.itemColumn}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.quantity}>Quantity: {item.quantity}</span>
                </th>
                {suppliers.map((supplier) => {
                  const line = supplier.lines.get(item.id);
                  return (
                    <td key={supplier.id}>
                      <span className={styles.lineTotal}>{formatPrice(line.lineTotal)}</span>
                      <span className={styles.unitPrice}>{formatPrice(line.unitPrice)} per unit</span>
                      <span className={styles.availability}>{line.availability}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th scope="row" className={styles.itemColumn}>Items subtotal</th>
              {suppliers.map((supplier) => (
                <td key={supplier.id}>{formatPrice(supplier.itemsTotal)}</td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={styles.itemColumn}>Delivery</th>
              {suppliers.map((supplier) => (
                <td key={supplier.id}>{formatPrice(supplier.deliveryCost)}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default function ComparisonView({ comparison }) {
  const hasQuotes = comparison.quotes.length > 0;
  const quoteLink = `/supplier-quote?comparisonId=${comparison.id}`;

  return (
    <main className={`page-comparison ${styles.page}`}>
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

      <header className="page-header">
        <p className="page-header-label">Comparison View</p>
        <h1>Comparison: {comparison.name}</h1>
      </header>

      {hasQuotes ? (
        <>
          <QuoteTable items={comparison.items} quotes={comparison.quotes} />
          <Link href={quoteLink} className="button button-secondary page-action">
            Add Supplier Quote
          </Link>
        </>
      ) : (
        <>
          <section>
            <h2>Requested Items</h2>
            <table className={styles.requestedItems}>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Quantity</th>
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
          </section>
          <section>
            <h2>Supplier Quotes</h2>
            <p>No supplier quotes added yet.</p>
            <Link href={quoteLink} className="button button-secondary">
              Add Supplier Quote
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
