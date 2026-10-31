"use client";

import { useContext } from "react";
import Link from "next/link";
import ComparisonCard from "@/components/ComparisonCard";
import { ComparisonContext } from "./context/ComparisonContext";

export default function Home() {
  const { comparison, supplierQuotes } = useContext(ComparisonContext);

  return (
    <main className="page-dashboard">
      <header className="page-header">
        <p className="page-header-label">Dashboard</p>
        <h1>Supplier Quote Comparator</h1>
      </header>

      <Link href="/new-comparison" className="button button-primary">
        + New Comparison
      </Link>

      <h2>Your Comparisons</h2>

      {comparison ? (
        <ComparisonCard
          comparison={{
            name: comparison.name,
            items: comparison.items.length,
            suppliers: supplierQuotes.length,
          }}
        />
      ) : (
        <p className="status-message">No comparison has been created yet.</p>
      )}
    </main>
  );
}
