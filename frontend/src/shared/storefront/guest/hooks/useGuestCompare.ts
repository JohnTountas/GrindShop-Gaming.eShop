import { useEffect, useState } from 'react';
import { defaultStorefrontState, guestCompareUpdatedEvent } from '../../constants';
import type { StorefrontToggleResult } from '../../types';
import {
  clearGuestCompareIds,
  persistGuestCompareIds,
  readGuestCompareIds,
} from '../utils/guestCompareStorage';

// Guest compare state backed by local storage only.
export function useGuestCompare(enabled: boolean) {
  const [guestIds, setGuestIds] = useState<string[]>(() => readGuestCompareIds());
  const compareLimit = defaultStorefrontState.compareLimit;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const syncFromStorage = () => setGuestIds(readGuestCompareIds());
    syncFromStorage();

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener(guestCompareUpdatedEvent, syncFromStorage);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener(guestCompareUpdatedEvent, syncFromStorage);
    };
  }, [enabled]);

  return {
    ids: enabled ? guestIds : [],
    isLoading: false,
    async toggle(productId: string): Promise<StorefrontToggleResult> {
      const exists = guestIds.includes(productId);
      let reachedLimit = false;
      let nextIds: string[];

      if (exists) {
        nextIds = guestIds.filter((id) => id !== productId);
      } else if (guestIds.length >= compareLimit) {
        reachedLimit = true;
        nextIds = [...guestIds.slice(1), productId];
      } else {
        nextIds = [...guestIds, productId];
      }

      setGuestIds(nextIds);
      persistGuestCompareIds(nextIds);

      return {
        added: !exists,
        ids: nextIds,
        reachedLimit,
      };
    },
    clear() {
      setGuestIds([]);
      clearGuestCompareIds();
    },
    clearOnWindowClose() {
      clearGuestCompareIds();
    },
  };
}
