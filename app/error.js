"use client";

export default function Error({ retry }) {
  return (
    <main className="page-dashboard">
      <p className="status-message" role="alert">
        Could not load comparisons. Please try again.
      </p>
      <button type="button" className="button button-secondary" onClick={retry}>
        Try Again
      </button>
    </main>
  );
}
