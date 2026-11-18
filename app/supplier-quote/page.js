import Link from "next/link";
import prisma from "@/lib/prisma";
import SupplierQuoteForm from "./SupplierQuoteForm";

function StatusPage({ message }) {
  return (
    <main className="page-supplier-quote">
      <p className="status-message">{message}</p>

      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>
    </main>
  );
}

export default async function SupplierQuotePage({ searchParams }) {
  const { comparisonId } = await searchParams;

  if (comparisonId === undefined) {
    return <StatusPage message="No comparison selected." />;
  }

  const numericId = Number(comparisonId);

  if (
    typeof comparisonId !== "string" ||
    !/^[1-9]\d*$/.test(comparisonId) ||
    !Number.isSafeInteger(numericId) ||
    numericId > 2147483647
  ) {
    return <StatusPage message="Invalid comparison ID." />;
  }

  const comparison = await prisma.comparison.findUnique({
    where: { id: numericId },
    include: { items: true },
  });

  if (!comparison) {
    return <StatusPage message="Comparison not found." />;
  }

  return <SupplierQuoteForm comparison={comparison} />;
}
