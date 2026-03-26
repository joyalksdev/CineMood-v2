import { useEffect, useLayoutEffect } from 'react';

export const useLockBodyScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.setProperty('overflow', 'hidden', 'important');
      return () => document.body.style.removeProperty('overflow');
    }
  }, [isOpen]);
};