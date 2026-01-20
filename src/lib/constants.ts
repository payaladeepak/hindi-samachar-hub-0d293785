// News Categories with Hindi labels
export const NEWS_CATEGORIES = {
  politics: { label: 'राजनीति', color: 'bg-primary' },
  sports: { label: 'खेल', color: 'bg-success' },
  entertainment: { label: 'मनोरंजन', color: 'bg-secondary' },
  national: { label: 'देश', color: 'bg-accent' },
  international: { label: 'विदेश', color: 'bg-primary' },
  business: { label: 'व्यापार', color: 'bg-warning' },
  technology: { label: 'तकनीक', color: 'bg-accent' },
  health: { label: 'स्वास्थ्य', color: 'bg-success' },
} as const;

export type NewsCategory = keyof typeof NEWS_CATEGORIES;

export const SITE_NAME = 'ताज़ा खबर';
export const SITE_TAGLINE = 'सच की आवाज़';
