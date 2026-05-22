'use client';

import { AppLink } from '@/components/AppLink';
import { useEffect, useState } from 'react';
import {
  COOKIE_NOTICE_STORAGE_KEY,
  COOKIE_NOTICE_TEXT,
} from '@/content/legal';

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const acknowledged = localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY);
      if (!acknowledged) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, '1');
    } catch {
      /* storage indisponível — oculta na sessão */
    }
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <aside
      className="cookie-notice"
      role="dialog"
      aria-label="Informação sobre cookies"
      aria-live="polite"
    >
      <p className="cookie-notice__text">
        {COOKIE_NOTICE_TEXT}{' '}
        <AppLink href="/privacidade#cookies" className="cookie-notice__link">
          Política
        </AppLink>
      </p>
      <button type="button" className="cookie-notice__btn" onClick={dismiss}>
        Ciência
      </button>
    </aside>
  );
}
