export interface ParsedSalary {
  min: number;
  max: number;
  currency: string;
}

export function parseSalary(salary: string): ParsedSalary {
  if (!salary || salary.trim() === "") {
    return { min: 0, max: 0, currency: "" };
  }

  const currencyMatch = salary.match(/[$€£¥]/);
  const currency = currencyMatch ? currencyMatch[0] : "";
  const numbers: number[] = [];
  const matches = salary.matchAll(/(\d+(?:[,.]\d+)?)[kK]?/g);

  for (const match of matches) {
    let num = parseFloat(match[1].replace(",", ""));
    if (match[0].toLowerCase().includes("k")) {
      num *= 1000;
    }
    numbers.push(num);
  }

  if (numbers.length === 0) {
    return { min: 0, max: 0, currency };
  }

  if (numbers.length === 1) {
    return { min: numbers[0], max: numbers[0], currency };
  }

  return { min: numbers[0], max: numbers[1], currency };
}

export function formatPostedDate(isoDate: string): string {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 60) return "1 month ago";
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  if (diffDays < 730) return "1 year ago";
  return `${Math.floor(diffDays / 365)} years ago`;
}
