export default function (classes: string[] | string) {
  if (Array.isArray(classes)) {
    return classes.join(" ");
  } else {
    return classes;
  }
}

export const formatPct = new Intl.NumberFormat("us-en", {
  style: "percent",
  minimumFractionDigits: 2,
}).format;

export function convertRemToPixels(rem: string | number) {
  return (
    // @ts-expect-error this actually works fine
    parseFloat(rem) *
    parseFloat(getComputedStyle(document.documentElement).fontSize)
  );
}
