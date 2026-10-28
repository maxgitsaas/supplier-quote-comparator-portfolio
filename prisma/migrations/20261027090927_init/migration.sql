-- CreateTable
CREATE TABLE "Comparison" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Comparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonItem" (
    "id" SERIAL NOT NULL,
    "comparisonId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ComparisonItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierQuote" (
    "id" SERIAL NOT NULL,
    "comparisonId" INTEGER NOT NULL,
    "supplierName" TEXT NOT NULL,
    "deliveryCost" DECIMAL(65,30) NOT NULL,
    "leadTime" TEXT NOT NULL,

    CONSTRAINT "SupplierQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "id" SERIAL NOT NULL,
    "supplierQuoteId" INTEGER NOT NULL,
    "comparisonItemId" INTEGER NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "availability" TEXT NOT NULL,

    CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComparisonItem" ADD CONSTRAINT "ComparisonItem_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierQuote" ADD CONSTRAINT "SupplierQuote_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_supplierQuoteId_fkey" FOREIGN KEY ("supplierQuoteId") REFERENCES "SupplierQuote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_comparisonItemId_fkey" FOREIGN KEY ("comparisonItemId") REFERENCES "ComparisonItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
