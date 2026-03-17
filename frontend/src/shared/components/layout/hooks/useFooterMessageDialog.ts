import { useEffect, useMemo, useState } from 'react';
import {
  FOOTER_MESSAGE_EVENT,
  FOOTER_MESSAGES,
  POLICY_FOOTER_LINKS,
  SUPPORT_FOOTER_LINKS,
  type FooterMessageKey,
} from '../constants';

function isFooterMessageKey(value: unknown): value is FooterMessageKey {
  return typeof value === 'string' && value in FOOTER_MESSAGES;
}

// Owns footer-modal state and the global events that can open policy/support content.
export function useFooterMessageDialog() {
  const [activeFooterMessage, setActiveFooterMessage] = useState<FooterMessageKey | null>(null);

  const activeMessage = useMemo(
    () => {
      if (!activeFooterMessage) {
        return null;
      }

      const section = SUPPORT_FOOTER_LINKS.some((item) => item.key === activeFooterMessage)
        ? 'Support'
        : POLICY_FOOTER_LINKS.some((item) => item.key === activeFooterMessage)
          ? 'Policies'
          : 'Information';

      return {
        section,
        ...FOOTER_MESSAGES[activeFooterMessage],
      };
    },
    [activeFooterMessage]
  );

  useEffect(() => {
    function handleOpenFooterMessage(event: Event) {
      const customEvent = event as CustomEvent<unknown>;
      if (isFooterMessageKey(customEvent.detail)) {
        setActiveFooterMessage(customEvent.detail);
      }
    }

    window.addEventListener(FOOTER_MESSAGE_EVENT, handleOpenFooterMessage);
    return () => {
      window.removeEventListener(FOOTER_MESSAGE_EVENT, handleOpenFooterMessage);
    };
  }, []);

  useEffect(() => {
    if (!activeFooterMessage) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveFooterMessage(null);
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeFooterMessage]);

  return {
    activeMessage,
    openFooterMessage: setActiveFooterMessage,
    closeFooterMessage: () => setActiveFooterMessage(null),
  };
}
