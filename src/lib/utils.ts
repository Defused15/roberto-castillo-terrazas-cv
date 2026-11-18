import {type ClassValue, clsx} from 'clsx';

/**
 * Joins class names. It does not resolve conflicting Tailwind utilities
 * (tailwind-merge cost ~6 kB gzip of first-load JS): components keep size,
 * spacing and font-size in variants so callers never override a base class.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
