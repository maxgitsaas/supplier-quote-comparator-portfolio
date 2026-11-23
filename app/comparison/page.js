import Link from "next/link";
import prisma from "@/lib/prisma";
import ComparisonView from "./ComparisonView";

function StatusPage({ message }) {
  return (
    <main className="page-comparison">
      <p className="status-message">{message}</p>

      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>
    </main>
  );
}

export default async function ComparisonPage({ searchParams }) {
  // 1. Read the ID from the URL
  const { id } = await searchParams;

  // 2. Handle missing ID
  if (id === undefined) {
    return <StatusPage message="No comparison selected." />;
  }

  // 3. Validate the ID
  const numericId = Number(id);

  if (
    typeof id !== "string" ||
    !/^[1-9]\d*$/.test(id) ||
    !Number.isSafeInteger(numericId) ||
    numericId > 2147483647
  ) {
    return <StatusPage message="Invalid comparison ID." />;
  }

  // 4. Fetch from PostgreSQL
  const comparison = await prisma.comparison.findUnique({
    where: { id: numericId },
    include: {
      items: true,
      quotes: {
        include: {
          quoteItems: true,
        },
      },
    },
  });

  // 5. Handle nonexistent comparison
  if (!comparison) {
    return <StatusPage message="Comparison not found." />;
  }

  // 6. Prepare supplier quotes for the Client Component
  const supplierQuotes = comparison.quotes.map((quote) => ({
    id: quote.id,
    supplierName: quote.supplierName,
    deliveryCost: quote.deliveryCost.toString(),
    leadTime: quote.leadTime,
    quoteItems: quote.quoteItems.map((item) => ({
      id: item.id,
      comparisonItemId: item.comparisonItemId,
      unitPrice: item.unitPrice.toString(),
      availability: item.availability,
    })),
  }));

  // 7. Pass the prepared data to ComparisonView
  return (
    <ComparisonView
      comparison={{
        id: comparison.id,
        name: comparison.name,
        items: comparison.items,
      }}
      supplierQuotes={supplierQuotes}
    />
  );
}
