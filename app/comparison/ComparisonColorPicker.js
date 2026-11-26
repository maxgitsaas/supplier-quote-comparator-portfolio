"use client";

import { useActionState, useEffect, useRef } from "react";
import { comparisonColors, getComparisonColor } from "@/lib/comparison-colors";
import { updateComparisonColor } from "../actions";
import styles from "./ComparisonView.module.css";

const colorOptions = [...comparisonColors, { value: "", label: "No color" }];

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

  useEffect(() => {
    const picker = pickerRef.current;
    if (state?.message && picker.open) {
      picker.open = false;
      picker.querySelector("summary").focus();
    }
  }, [state]);

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
      <form action={saveColor} className={styles.colorForm} aria-busy={pending}>
        {colorOptions.map(({ value, label, hex }) => {
          const selected = value === (selectedColor?.value ?? "");
          return (
            <button
              key={value}
              type="submit"
              name="color"
              value={value}
              className={styles.colorOption}
              aria-pressed={selected}
              disabled={pending}
            >
              <span
                aria-hidden="true"
                className={styles.optionSwatch}
                style={{ backgroundColor: hex }}
              />
              {label}
              {selected && <span aria-hidden="true" className={styles.colorCheck}>✓</span>}
            </button>
          );
        })}
        {state?.error && <p role="alert" className="form-error">{state.error}</p>}
      </form>
    </details>
  );
}
