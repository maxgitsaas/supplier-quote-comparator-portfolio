"use client";

import { useActionState, useState } from "react";
import { comparisonColors, getComparisonColor } from "@/lib/comparison-colors";
import { updateComparisonColor } from "../actions";
import styles from "./ComparisonView.module.css";

export default function ComparisonColorPicker({ comparisonId, color }) {
  const [draft, setDraft] = useState(color ?? "");
  const [state, saveColor, pending] = useActionState(
    updateComparisonColor.bind(null, comparisonId),
    null,
  );
  const selectedColor = getComparisonColor(color);

  return (
    <details className={styles.colorPicker}>
      <summary className="button button-secondary">
        <span
          aria-hidden="true"
          className={styles.colorDot}
          style={{ backgroundColor: selectedColor?.hex }}
        />
        Color
        <span aria-hidden="true" className={styles.colorChevron}>▾</span>
      </summary>
      <form action={saveColor} className={styles.colorForm}>
        <label htmlFor="comparison-color">Comparison color</label>
        <select
          id="comparison-color"
          name="color"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={pending}
        >
          <option value="">No color</option>
          {comparisonColors.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button className="button button-secondary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save color"}
        </button>
        {state?.error && <p role="alert" className="form-error">{state.error}</p>}
        {state?.message && !state.error && draft === (color ?? "") && (
          <p role="status" className={styles.colorStatus}>{state.message}</p>
        )}
      </form>
    </details>
  );
}
