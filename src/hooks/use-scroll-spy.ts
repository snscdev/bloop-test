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

    // Punto de referencia: justo después del offset (navbar + progress bar)
    const referencePoint = offset;

    // Find which section is currently in view
    const sections = sectionIds
      .map((id) => {
        const element = document.getElementById(id);
        if (!element) return null;

        const rect = element.getBoundingClientRect();

        return {
          id,
          rect,
          // Una sección está "activa" si su top está antes del punto de referencia
          // y su bottom está después del punto de referencia (la sección cruza el punto)
          isActive: rect.top <= referencePoint && rect.bottom > referencePoint,
          // Distancia del top de la sección al punto de referencia
          distanceFromTop: Math.abs(rect.top - referencePoint),
        };
      })
      .filter(Boolean);

    if (sections.length === 0) return;

    // Buscar la sección que cruza el punto de referencia
    let currentActive = sections.find((section) => section && section.isActive);

    // Si ninguna sección cruza el punto exacto, tomar la más cercana
    if (!currentActive) {
      currentActive = sections.reduce((closest, section) => {
        if (!section || !closest) return section || closest;
        return section.distanceFromTop < closest.distanceFromTop ? section : closest;
      }, sections[0]);
    }

    if (currentActive) {
      setActiveSection(currentActive.id);
    }
  }, [sectionIds, offset]);

  useEffect(() => {
    let rafId: number | null = null;

    const throttledHandleScroll = () => {
      // Cancelar cualquier animación pendiente
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Usar requestAnimationFrame para mejor rendimiento
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [handleScroll]);

  return {
    activeSection,
    scrollY,
    isScrolled,
  };
}
