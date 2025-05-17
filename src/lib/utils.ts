
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'N/A';
  return `${value.toFixed(2)}%`;
}

export function getColorByPercentage(percentage: number | undefined | null): string {
  if (percentage === undefined || percentage === null) return '';
  if (percentage < 75) return 'text-red-600';
  if (percentage < 90) return 'text-yellow-600';
  return 'text-green-600';
}
