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

    // Guard wheel events on desktop so mouse scroll stays isolated in the popup
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const scrollable = target.closest('.overflow-y-auto, .overflow-auto, [data-scrollable="true"]');
      if (!scrollable) {
        if (e.cancelable) e.preventDefault();
      } else {
        const el = scrollable as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = el;
        const delta = e.deltaY;
        const isUp = delta < 0;
        const isDown = delta > 0;
        // Stop scroll propagation to background when boundary is reached
        if ((isUp && scrollTop <= 0) || (isDown && scrollTop + clientHeight >= scrollHeight - 1)) {
          if (e.cancelable) e.preventDefault();
        }
      }
    };

    // Guard touchmove on mobile devices
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const scrollable = target.closest('.overflow-y-auto, .overflow-auto, [data-scrollable="true"]');
      if (!scrollable) {
        if (e.cancelable) e.preventDefault();
      } else {
        const el = scrollable as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = el;
        const currentY = e.touches[0]?.clientY ?? 0;
        const deltaY = touchStartY - currentY;
        const isUp = deltaY < 0;
        const isDown = deltaY > 0;
        if ((isUp && scrollTop <= 0) || (isDown && scrollTop + clientHeight >= scrollHeight - 1)) {
          if (e.cancelable) e.preventDefault();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
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

