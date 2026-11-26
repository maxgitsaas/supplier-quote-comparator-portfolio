"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import ComparisonHeader from "@/components/ComparisonHeader";
import QuoteItemCard from "@/components/QuoteItemCard";
import { useRouter } from "next/navigation";
import { readLeadTimeDays } from "@/lib/lead-time";
import { createSupplierQuote } from "../actions";

export default function SupplierQuoteForm({ comparison }) {
  const [supplierName, setSupplierName] = useState("");
  const [deliveryCost, setDeliveryCost] = useState("");
  const [leadTime, setLeadTime] = useState("");

  const [detailsError, setDetailsError] = useState("");
  const [itemError, setItemError] = useState("");

  const [isPending, startTransition] = useTransition();

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
    if (isPending) return;

    if (supplierName.trim() === "") {
      setDetailsError("Please enter a supplier name.");
      return;
    }

    if (deliveryCost === "" || Number(deliveryCost) < 0) {
      setDetailsError("Please enter a valid delivery cost.");
      return;
    }

    if (readLeadTimeDays(leadTime) === null) {
      setDetailsError("Enter lead time as a nonnegative number of whole days.");
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
      comparisonId: comparison.id,
      supplierName,
      deliveryCost,
      leadTime,
      items: quoteItems.map((item) => ({
        comparisonItemId: item.id,
        unitPrice: item.unitPrice,
        availability: item.availability,
      })),
    };

    setDetailsError("");

    startTransition(async () => {
      try {
        await createSupplierQuote(supplierQuote);

        router.push(`/comparison?id=${comparison.id}`);
      } catch (error) {
        console.error("Failed to save supplier quote:", error);
        setDetailsError("Could not save the quote. Please try again.");
      }
    });
  }

  return (
    <main className="page-supplier-quote">
      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>

      <ComparisonHeader comparison={comparison} label="Enter Quote" />

      <Link
        href={`/comparison?id=${comparison.id}`}
        className="button button-context page-action"
      >
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
            Lead time (days)
            <input
              type="number"
              min="0"
              step="1"
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

      <button
        type="button"
        className="button button-primary"
        onClick={handleSaveQuote}
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save Quote"}
      </button>
    </main>
  );
}
