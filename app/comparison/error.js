"use client";

import Link from "next/link";

export default function Error({ reset }) {
  return (
    <main className="page-comparison">
      <p className="status-message" role="alert">
        Could not load comparison. Please try again.
      </p>

      <button
        type="button"
        className="button button-secondary"
        onClick={() => reset()}
      >
        Try Again
      </button>

      <Link href="/" className="back-dashboard">
        ← Back to Dashboard
      </Link>
    </main>
  );
}
