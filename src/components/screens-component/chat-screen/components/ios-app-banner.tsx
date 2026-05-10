import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { environment } from '@/lib/config/environment';
import { CHAT_ASSISTANT } from '../config';

const BANNER_DISMISSED_KEY = 'ios_app_banner_dismissed';

export function IosAppBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  const text = t('iosAppBanner.text') as string;
  const linkText = t('iosAppBanner.linkText') as string;

  return (
    <div className="flex items-center gap-3 border-b border-gray-200 bg-[#f2f2f7] px-3 py-2 dark:border-white/10 dark:bg-[#1c1c1e]">
      {/* Close */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      {/* App icon */}
      <img
        src={CHAT_ASSISTANT.avatar}
        alt="App icon"
        className="h-12 w-12 shrink-0 rounded-[14px] border border-black/10 object-cover shadow-sm dark:border-white/10"
      />

      {/* App info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight text-gray-900 dark:text-white">
          {t('appTitle') as string}
        </p>
        <p className="line-clamp-2 text-xs leading-snug text-gray-500 dark:text-gray-400">
          {text}
        </p>
      </div>

      {/* GET button */}
      <a
        href={environment.iosAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={linkText}
        className="shrink-0 rounded-full bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-bold text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
      >
        GET
      </a>
    </div>
  );
}
