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
      items: { orderBy: { id: "asc" } },
      quotes: {
        orderBy: { id: "asc" },
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

  return <ComparisonView comparison={comparison} />;
}
