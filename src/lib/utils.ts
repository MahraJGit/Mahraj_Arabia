import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Card grids that never show empty gray cells in incomplete rows. */
export const cardGridClass = "grid border-t border-l border-border"
export const cardGridItemClass = "border-b border-r border-border bg-background"
