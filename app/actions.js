"use server";

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
