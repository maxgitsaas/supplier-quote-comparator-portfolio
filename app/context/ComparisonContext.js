"use client";

import { createContext, useState } from "react";

export const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [comparison, setComparison] = useState(null);
  const [supplierQuotes, setSupplierQuotes] = useState([]);

  return (
    <ComparisonContext.Provider
      value={{
        comparison,
        setComparison,
        supplierQuotes,
        setSupplierQuotes,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}
