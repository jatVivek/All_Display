import { useEffect } from 'react';

let lockCount = 0;
let originalBodyOverflow = '';
let originalHtmlOverflow = '';
let originalBodyOverscroll = '';
let originalHtmlOverscroll = '';
let scrollY = 0;

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    lockCount++;
    if (lockCount === 1) {
      // Record original state
      scrollY = window.scrollY;
      originalBodyOverflow = document.body.style.overflow;
      originalHtmlOverflow = document.documentElement.style.overflow;
      originalBodyOverscroll = document.body.style.overscrollBehavior;
      originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

      // Lock scroll on both body and html
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
    }

    // Touch event guard for mobile devices (iOS Safari / Chrome mobile)
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Allow touch scrolling ONLY inside elements designated as scrollable
      const scrollable = target.closest('.overflow-y-auto, .overflow-auto, [data-scrollable="true"]');
      if (!scrollable) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overscrollBehavior = originalBodyOverscroll;
        document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      }
    };
  }, [isLocked]);
}

