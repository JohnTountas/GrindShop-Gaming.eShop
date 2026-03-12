import { guestCompareStorageKey, guestCompareUpdatedEvent } from '../../constants';

function dispatchGuestCompareUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(guestCompareUpdatedEvent));
}

export function readGuestCompareIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(guestCompareStorageKey);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((value): value is string => typeof value === 'string');
    }

    localStorage.removeItem(guestCompareStorageKey);
    return [];
  } catch {
    localStorage.removeItem(guestCompareStorageKey);
    return [];
  }
}

export function persistGuestCompareIds(ids: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(guestCompareStorageKey, JSON.stringify(ids));
  dispatchGuestCompareUpdated();
}

export function clearGuestCompareIds() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(guestCompareStorageKey);
  dispatchGuestCompareUpdated();
}
