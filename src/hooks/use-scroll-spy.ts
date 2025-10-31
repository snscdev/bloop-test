import { useState, useEffect, useCallback } from 'react';

type UseScrollSpyOptions = {
  sectionIds: string[];
  offset?: number;
  throttle?: number;
};

type UseScrollSpyReturn = {
  activeSection: string | null;
  scrollY: number;
  isScrolled: boolean;
};

export function useScrollSpy({
  sectionIds,
  offset = 100,
  throttle = 100,
}: UseScrollSpyOptions): UseScrollSpyReturn {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setIsScrolled(currentScrollY > 100);

    // Find which section is currently in view
    const sections = sectionIds
      .map((id) => {
        const element = document.getElementById(id);
        if (!element) return null;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + currentScrollY;
        const elementBottom = elementTop + rect.height;

        return {
          id,
          top: elementTop,
          bottom: elementBottom,
          isInView: rect.top <= offset && rect.bottom >= offset,
        };
      })
      .filter(Boolean);

    // Find the section that is most visible
    const visibleSection = sections.find((section) => section && section.isInView);

    if (visibleSection) {
      setActiveSection(visibleSection.id);
    } else {
      // If no section is in the offset zone, find the closest one
      const closestSection = sections.reduce((closest, section) => {
        if (!section || !closest) return section || closest;

        const sectionDistance = Math.abs(section.top - currentScrollY);
        const closestDistance = Math.abs(closest.top - currentScrollY);

        return sectionDistance < closestDistance ? section : closest;
      }, sections[0]);

      if (closestSection) {
        setActiveSection(closestSection.id);
      }
    }
  }, [sectionIds, offset]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const throttledHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        handleScroll();
      }, throttle);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleScroll, throttle]);

  return {
    activeSection,
    scrollY,
    isScrolled,
  };
}
