# Supplier Quote Comparator

A full-stack B2B web application for comparing supplier quotations in a structured, side-by-side view.

**Status:** Working development prototype, designed for local use.  
**Stack:** Next.js · React · JavaScript · Prisma · PostgreSQL

## Product demonstration

**[Watch the product demo on YouTube (German narration)](https://youtu.be/IkND-Rw3Vr4)**

Click the preview below to watch the demonstration.

[![Supplier Quote Comparator overview showing two supplier quotations, total costs and lead times — watch the demo on YouTube](screenshots/comparison-overview.png)](https://youtu.be/IkND-Rw3Vr4)

*Example comparison: five new workstations. The buyer can save €210 with DigitalDepot or receive the order three days earlier with TechOffice, based on the quoted lead times.*

## The problem

When a business requests quotations from several suppliers for the same purchase, it may have to consolidate prices, quantities, availability, delivery costs and lead times from separate documents or emails. This makes it difficult to compare offers consistently and understand the trade-offs.

Supplier Quote Comparator turns that workflow into a structured application: the buyer defines the requested items once, records each supplier's offer against those items, and compares the results in one place.

## Core functionality

- Create and save purchasing comparisons with a shared list of requested items and quantities.
- Enter multiple supplier quotes, including unit prices, item availability, delivery costs and lead times.
- Compare item subtotals, delivery-inclusive totals and supplier information side by side.
- View a decision summary highlighting price savings and the shortest comparable lead time.
- Expand item details and assign colour labels to saved comparisons.
- Reopen saved comparisons from a database-backed dashboard after a browser refresh.

The application supports purchasing decisions rather than automatically choosing a supplier. Quote entry is manual in the current version.

## Application screenshots

<details>
<summary><strong>View detailed comparison</strong> — quantities, unit prices and availability</summary>

![Expanded comparison showing item quantities, unit prices, availability, total costs and lead times](screenshots/comparison-details.png)

</details>

<details>
<summary><strong>View complete application workflow</strong> — dashboard, purchasing requirements and supplier quote entry</summary>

### 1. Dashboard

The buyer can reopen saved comparisons, see item and quote counts, or start a new comparison.

![Dashboard with saved comparisons and colour labels](screenshots/dashboard.png)

### 2. Define purchasing requirements

Create a comparison and add the requested items and quantities. In this example, the buyer needs five laptops and five monitors.

![New comparison form with two requested items](screenshots/new-comparison.png)

### 3. Review the new comparison

The requested items are saved and displayed before any supplier quotations have been entered.

![Newly created comparison with requested items and no supplier quotes](screenshots/comparison-view-before-quote-entry.png)

### 4. Enter a supplier quote

The existing requested items are carried into the quote form. Enter the supplier's unit prices, availability, delivery cost and lead time.

![Completed supplier quote form for TechOffice](screenshots/supplier-quote-entry.png)

### 5. Compare supplier offers

Once quotes have been saved, the comparison view calculates totals and highlights the price and lead-time trade-offs shown in the overview at the top of this README.

</details>

## Technical architecture

```mermaid
flowchart TD
    A[React forms and interface] -->|Create or update| B[Next.js Server Actions]
    C[Next.js Server Components] -->|Read| D[Prisma Client]
    B -->|Validate and persist| D
    D --> E[(PostgreSQL)]
    E --> D
    D --> C
    C --> F[Dashboard and comparison view]
```

React state handles values while a user edits a form. Server Actions handle database writes; server-side pages retrieve saved records through Prisma. Quote totals are calculated from stored quantities, unit prices and delivery costs using decimal arithmetic rather than persisted as redundant totals.

### Relational data model

```mermaid
erDiagram
    Comparison ||--o{ ComparisonItem : contains
    Comparison ||--o{ SupplierQuote : receives
    SupplierQuote ||--o{ QuoteItem : contains
    ComparisonItem ||--o{ QuoteItem : references
```

Each quote line references the original requested item by ID, allowing supplier offers to be compared against the same item list. Supplier quote validation checks that submitted item IDs belong to the selected comparison and appear exactly once.

### Technology and implementation

| Layer | Technology |
| --- | --- |
| Application framework | Next.js 16 (App Router) |
| Interface | React 19, JavaScript, CSS modules |
| Backend | Next.js Server Actions and server-side database queries |
| Data access | Prisma ORM 7 and PostgreSQL adapter |
| Database | PostgreSQL (Neon in my development setup) |
| Version control | Git and GitHub |

## Development process and my contribution

I built this project independently as a practical software engineering and product development project, using AI assistance for learning, implementation support and troubleshooting.

I started by mapping the procurement workflow, defining the minimum data model and designing the core screens. I then built a static React interface, introduced interactive forms and shared client-side state, and gradually replaced temporary state with a persistent PostgreSQL-backed architecture.

My focus has been to understand the application end to end: how user input becomes a server-side operation, how related records are stored and retrieved, and how the interface transforms that data into useful business information. I developed the application incrementally, using Git commits and milestone tags to record progress.

## Run locally

### Prerequisites

- Node.js 24 and npm
- A separate PostgreSQL development database (local or hosted)

Clone the repository and install its locked dependencies:

```bash
git clone https://github.com/maxgitsaas/supplier-quote-comparator-portfolio.git
cd supplier-quote-comparator-portfolio
npm ci
```

Create a `.env` file at the repository root containing your own database connection string:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

Replace the placeholders with your development database credentials. Hosted databases may require additional SSL connection parameters. Never commit this file or use another person's database credentials.

Apply the included migrations to your dedicated development database and generate Prisma Client:

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create a comparison, add requested items, and enter two or more supplier quotations to explore the workflow.

Additional project commands:

```bash
npm run lint
npm run build
```

## Project structure

```text
app/                 Pages, forms, comparison interface and server actions
components/          Reusable React components
lib/                 Database access and shared helpers
prisma/              Relational schema and database migrations
prisma7.config.ts    Prisma configuration
```

## Current scope and next steps

This is a single-user development prototype, not a production procurement system. It does not currently include authentication, comprehensive edit/delete workflows, PDF uploads or AI-based quote extraction. Do not deploy the writable application publicly without adding appropriate access controls and further validation.

A future extension would let users upload supplier quotation PDFs, extract structured values with AI, and review uncertain item matches before saving. The existing manual workflow and relational model provide the foundation for that extension.
