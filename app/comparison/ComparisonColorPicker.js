"use client";

import { useActionState, useEffect, useRef } from "react";
import { comparisonColors, getComparisonColor } from "@/lib/comparison-colors";
import { updateComparisonColor } from "../actions";
import styles from "./ComparisonView.module.css";

export default function ComparisonColorPicker({ comparisonId, color }) {
  const pickerRef = useRef(null);
  const [state, saveColor, pending] = useActionState(
    updateComparisonColor.bind(null, comparisonId),
    null,
  );
  const selectedColor = getComparisonColor(color);

  useEffect(() => {
    const picker = pickerRef.current;

    function closeOnOutsidePointer(event) {
      if (picker.open && !picker.contains(event.target)) {
        picker.open = false;
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, []);

  return (
    <details
      ref={pickerRef}
      className={styles.colorPicker}
      onKeyDown={(event) => {
        if (event.key === "Escape" && event.currentTarget.open) {
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary").focus();
        }
      }}
    >
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
          key={color ?? ""}
          defaultValue={color ?? ""}
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
        {state?.message && (
          <p role="status" className={styles.colorStatus}>{state.message}</p>
        )}
      </form>
    </details>
  );
}
