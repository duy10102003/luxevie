import { slugify } from './slugify.js';

export function buildCombinedCategorySlug(subCategoryBase, gender) {
  const base = slugify(subCategoryBase || '');
  const g = slugify(gender || '');
  if (!base || !g) return '';
  return `${base}-${g}`;
}

export function normalizeGender(input) {
  const s = slugify(input || '');
  if (s === 'nam') return 'nam';
  if (s === 'nu') return 'nu';
  return s; // fallback, still normalized
}


