import { useEffect } from 'react';

let activeLocks = 0;
let originalBodyOverflow = '';
let originalRootOverflow = '';
let originalRootOverscrollBehavior = '';

export const useBodyScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (!isLocked) return;

    if (activeLocks === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalRootOverflow = document.documentElement.style.overflow;
      originalRootOverscrollBehavior = document.documentElement.style.overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
    }
    activeLocks += 1;

    return () => {
      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks === 0) {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalRootOverflow;
        document.documentElement.style.overscrollBehavior = originalRootOverscrollBehavior;
      }
    };
  }, [isLocked]);
};
