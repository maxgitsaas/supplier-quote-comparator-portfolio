export const comparisonColors = [
  { value: "blue", label: "Blue", hex: "#2563eb" },
  { value: "teal", label: "Teal", hex: "#0f766e" },
  { value: "green", label: "Green", hex: "#4d7c0f" },
  { value: "amber", label: "Amber", hex: "#b45309" },
  { value: "rose", label: "Rose", hex: "#be185d" },
  { value: "violet", label: "Violet", hex: "#7c3aed" },
];

export function getComparisonColor(value) {
  return comparisonColors.find((color) => color.value === value);
}
