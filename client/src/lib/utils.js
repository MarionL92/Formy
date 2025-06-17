import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase())
    .join('')
}
