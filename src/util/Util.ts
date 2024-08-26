import numeral from "numeral";

export function formatNumber(number: number, pattern: string): string {
  return numeral(number).format(pattern);
}
