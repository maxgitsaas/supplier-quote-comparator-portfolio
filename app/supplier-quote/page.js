"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import QuoteItemCard from "@/components/QuoteItemCard";
import { ComparisonContext } from "../context/ComparisonContext";
import { useRouter } from "next/navigation";

export default function SupplierQuote() {
  const { comparison, setSupplierQuotes } = useContext(ComparisonContext);

  const [supplierName, setSupplierName] = useState("");
  const [deliveryCost, setDeliveryCost] = useState("");
  const [leadTime, setLeadTime] = useState("");

  const [detailsError, setDetailsError] = useState("");
  const [itemError, setItemError] = useState("");

  const router = useRouter();

  const [quoteItems, setQuoteItems] = useState(
    comparison
      ? comparison.items.map((item) => ({
          ...item,
          unitPrice: "",
          availability: "",
        }))
      : [],
  );

  function handleItemChange(index, field, value) {
    setQuoteItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );

    setItemError("");
  }

  function handleSaveQuote() {
    if (supplierName.trim() === "") {
      setDetailsError("Please enter a supplier name.");
      return;
    }

    if (deliveryCost === "" || Number(deliveryCost) < 0) {
      setDetailsError("Please enter a valid delivery cost.");
      return;
    }

    if (leadTime === "" || Number(leadTime) < 0) {
      setDetailsError("Please enter a valid lead time.");
      return;
    }

    const invalidItem = quoteItems.some(
      (item) =>
        item.unitPrice === "" ||
        Number(item.unitPrice) < 0 ||
        item.availability.trim() === "",
    );

    if (invalidItem) {
      setItemError(
        "Please complete the price and availability for every item.",
      );
      return;
    }

    const supplierQuote = {
      supplierName,
      deliveryCost,
      leadTime,
      items: quoteItems,
    };

    setSupplierQuotes((currentQuotes) => [...currentQuotes, supplierQuote]);

    setDetailsError("");
    setItemError("");

    router.push("/comparison");
  }

  return (
    <main className="page-supplier-quote">
      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>

      <header className="page-header">
        <p className="page-header-label">Enter Quote</p>
        <h1>Supplier Quote</h1>
      </header>

      {comparison && <p>Comparison: {comparison.name}</p>}

      <Link href="/comparison" className="button button-context page-action">
        ← Back to Comparison
      </Link>

      <section>
        <h2>Supplier Details</h2>

        <div>
          <label>
            Supplier Name
            <input
              type="text"
              placeholder="e.g. Acme Supplies"
              value={supplierName}
              onChange={(event) => {
                setSupplierName(event.target.value);
                setDetailsError("");
              }}
            />
          </label>

          <label>
            Delivery Cost
            <input
              type="number"
              min="0"
              placeholder="e.g. 75"
              value={deliveryCost}
              onChange={(event) => {
                setDeliveryCost(event.target.value);
                setDetailsError("");
              }}
            />
          </label>

          <label>
            Lead Time
            <input
              type="number"
              min="0"
              placeholder="e.g. 7"
              value={leadTime}
              onChange={(event) => {
                setLeadTime(event.target.value);
                setDetailsError("");
              }}
            />
          </label>
        </div>
        {detailsError && <p className="form-error">{detailsError}</p>}
      </section>

      <section>
        <h2>Quoted Items</h2>

        {quoteItems.map((item, index) => (
          <QuoteItemCard
            key={index}
            item={item}
            index={index}
            onItemChange={handleItemChange}
          />
        ))}

        {itemError && <p className="form-error">{itemError}</p>}
      </section>

      <button className="button button-primary" onClick={handleSaveQuote}>
        Save Quote
      </button>
    </main>
  );
}
