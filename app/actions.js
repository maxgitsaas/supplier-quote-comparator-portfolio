"use server";

import { revalidatePath } from "next/cache";
import { getComparisonColor } from "@/lib/comparison-colors";
import { readLeadTimeDays } from "@/lib/lead-time";
import prisma from "@/lib/prisma";

export async function createComparison(comparison) {
  const savedComparison = await prisma.comparison.create({
    data: {
      name: comparison.name,
      items: {
        create: comparison.items,
      },
    },
  });

  revalidatePath("/");
  return savedComparison;
}

export async function getComparisonById(id) {
  const comparison = await prisma.comparison.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      items: true,
    },
  });

  return comparison;
}

export async function updateComparisonColor(id, _previousState, formData) {
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return { error: "Invalid comparison." };
  }

  const color = formData.get("color");
  if (color !== "" && !getComparisonColor(color)) {
    return { error: "Choose a color from the list." };
  }

  try {
    const { count } = await prisma.comparison.updateMany({
      where: { id },
      data: { color: color || null },
    });

    if (count === 0) return { error: "Comparison not found." };
  } catch (error) {
    console.error("Failed to update comparison color:", error);
    return { error: "Could not save the color. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/comparison");
  revalidatePath("/supplier-quote");
  return { message: "Color saved." };
}

export async function createSupplierQuote(quote) {
  // 1. Check that quote is a valid object type
  if (!quote || typeof quote !== "object" || Array.isArray(quote)) {
    throw new Error("Invalid quote data.");
  }

  // 2. Validate comparison ID
  if (
    !Number.isSafeInteger(quote.comparisonId) ||
    quote.comparisonId <= 0 ||
    quote.comparisonId > 2147483647
  ) {
    throw new Error("Invalid comparison ID.");
  }

  // 3. Validate supplier name
  if (
    typeof quote.supplierName !== "string" ||
    quote.supplierName.trim() === ""
  ) {
    throw new Error("Supplier name is required.");
  }

  // 4. Validate delivery cost
  if (
    quote.deliveryCost == null ||
    String(quote.deliveryCost).trim() === "" ||
    !Number.isFinite(Number(quote.deliveryCost)) ||
    Number(quote.deliveryCost) < 0
  ) {
    throw new Error("Invalid delivery cost.");
  }

  const leadTimeDays = readLeadTimeDays(quote.leadTime);
  if (leadTimeDays === null) throw new Error("Invalid lead time.");

  // 6. Validate quote items array
  if (!Array.isArray(quote.items) || quote.items.length === 0) {
    throw new Error("Quote must contain at least one item.");
  }

  // 7. Validate each quote item
  for (const item of quote.items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("Invalid quote item.");
    }

    if (
      !Number.isSafeInteger(item.comparisonItemId) ||
      item.comparisonItemId <= 0 ||
      item.comparisonItemId > 2147483647
    ) {
      throw new Error("Invalid comparison item ID.");
    }

    if (
      (typeof item.unitPrice !== "string" &&
        typeof item.unitPrice !== "number") ||
      String(item.unitPrice).trim() === "" ||
      !Number.isFinite(Number(item.unitPrice)) ||
      Number(item.unitPrice) < 0
    ) {
      throw new Error("Invalid unit price.");
    }

    if (
      typeof item.availability !== "string" ||
      item.availability.trim() === ""
    ) {
      throw new Error("Availability is required.");
    }
  }

  // 8. Retrieve the comparison's requested items
  const comparison = await prisma.comparison.findUnique({
    where: { id: quote.comparisonId },
    select: {
      items: {
        select: { id: true },
      },
    },
  });

  if (!comparison) {
    throw new Error("Comparison not found.");
  }

  // 9. Verify submitted item IDs
  const requestedIds = new Set(comparison.items.map((item) => item.id));

  const submittedIds = quote.items.map((item) => item.comparisonItemId);

  if (
    submittedIds.length !== requestedIds.size ||
    new Set(submittedIds).size !== submittedIds.length ||
    submittedIds.some((id) => !requestedIds.has(id))
  ) {
    throw new Error("Quote items do not match the comparison.");
  }

  // 10. Save supplier quote and quote items
  const savedQuote = await prisma.supplierQuote.create({
    data: {
      comparisonId: quote.comparisonId,
      supplierName: quote.supplierName.trim(),
      deliveryCost: quote.deliveryCost,
      leadTime: String(leadTimeDays),

      quoteItems: {
        create: quote.items.map((item) => ({
          comparisonItemId: item.comparisonItemId,
          unitPrice: item.unitPrice,
          availability: item.availability,
        })),
      },
    },

    select: { id: true },
  });

  revalidatePath("/");
  revalidatePath("/comparison");
  return savedQuote;
}
