// ============================================================
//  UTILITY FUNCTIONS
// ============================================================

export function getValue(id) {
  return document.getElementById(id).value;
}

export function setValue(id, value) {
  document.getElementById(id).value = value;
}

export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)  return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function normalizeTeamTag(tag) {
  return String(tag || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 5);
}

export function getTeamTag(teamName, customTag) {
  const normalizedCustomTag = normalizeTeamTag(customTag);
  if (normalizedCustomTag.length >= 2) return normalizedCustomTag;
  
  const words = String(teamName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.replace(/[^a-z0-9]/gi, ''))
    .filter(Boolean);

  const stopWords = new Set(['team', 'f1', 'formula', 'racing', 'motorsport', 'motorsports', 'scuderia']);
  const strongWords = words.filter(w => !stopWords.has(w.toLowerCase()));

  if (strongWords.length >= 2) {
    return strongWords.slice(0, 3).map(w => w[0]).join('').toUpperCase();
  }
  if (strongWords.length === 1) {
    return strongWords[0].slice(0, 3).toUpperCase();
  }
  if (words.length > 0) {
    return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
  }
  return 'CAR';
}

export function getRatingTier(overall) {
  if (overall >= 90) return { tierLabel: 'S', tierClass: 'rating-s' };
  if (overall >= 85) return { tierLabel: 'A', tierClass: 'rating-a' };
  if (overall >= 70) return { tierLabel: 'B', tierClass: 'rating-b' };
  if (overall >= 55) return { tierLabel: 'C', tierClass: 'rating-c' };
  return { tierLabel: 'D', tierClass: 'rating-d' };
}
