/* global document, window, HTMLElement, HTMLAnchorElement, IntersectionObserver */

const navigation = document.querySelector('[data-section-navigation]');

if (navigation instanceof HTMLElement) {
  const normalizePath = (path) => path.replace(/\/$/, '') || '/';
  const homePath = normalizePath(navigation.dataset.homePath ?? '');

  if (normalizePath(window.location.pathname) === homePath) {
    const links = Array.from(
      navigation.querySelectorAll('[data-section-id]'),
    ).filter((link) => link instanceof HTMLAnchorElement);
    const sections = links
      .map((link) => {
        const id = link.dataset.sectionId;
        return id ? document.getElementById(id) : null;
      })
      .filter((section) => section instanceof HTMLElement);
    const visibleSections = new Set();
    let pendingSectionId;

    const setActiveSection = (id) => {
      links.forEach((link) => {
        const isActive = link.dataset.sectionId === id;
        link.toggleAttribute('data-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const updateFromVisibleSections = () => {
      if (pendingSectionId) {
        const pendingSection = sections.find(
          (section) => section.id === pendingSectionId,
        );
        if (!pendingSection || !visibleSections.has(pendingSection)) return;
        pendingSectionId = undefined;
      }

      const marker = window.innerHeight * 0.2;
      const active = Array.from(visibleSections).sort(
        (first, second) =>
          Math.abs(first.getBoundingClientRect().top - marker) -
          Math.abs(second.getBoundingClientRect().top - marker),
      )[0];
      if (active) setActiveSection(active.id);
    };

    const updateAtPageEnd = () => {
      const pageEnd = window.scrollY + window.innerHeight;
      if (pageEnd >= document.documentElement.scrollHeight - 2) {
        const finalSection = sections.at(-1);
        if (finalSection) {
          pendingSectionId = undefined;
          setActiveSection(finalSection.id);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.add(entry.target);
          else visibleSections.delete(entry.target);
        });
        updateFromVisibleSections();
      },
      { rootMargin: '-18% 0px -62% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', updateAtPageEnd, { passive: true });
    links.forEach((link) =>
      link.addEventListener('click', () => {
        pendingSectionId = link.dataset.sectionId;
        setActiveSection(pendingSectionId);
      }),
    );

    const initialId = window.location.hash.slice(1);
    if (sections.some((section) => section.id === initialId)) {
      pendingSectionId = initialId;
      setActiveSection(initialId);
    }
  }
}
