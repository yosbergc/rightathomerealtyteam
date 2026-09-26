const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function cookieValue(name: string): string | undefined {
  return document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))?.[1];
}

function detectLocale(): void {
  if (cookieValue('realtypro_lang')) return;
  if (!navigator.language.toLowerCase().startsWith('es')) return;
  if (window.location.pathname.startsWith('/es')) return;
  const config = document.getElementById('locale-redirect') as HTMLScriptElement | null;
  if (!config?.textContent) return;
  try {
    const { other } = JSON.parse(config.textContent);
    if (typeof other === 'string' && other) window.location.assign(other);
  } catch {
    return;
  }
}

document.documentElement.classList.add('js-enabled');
detectLocale();

const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const applyHeaderState = () => {
    header.classList.toggle('is-solid', window.scrollY > 16);
  };
  applyHeaderState();
  window.addEventListener('scroll', applyHeaderState, { passive: true });
}

const menuToggles = document.querySelectorAll<HTMLButtonElement>('[data-menu-toggle]');
const menuOverlay = document.querySelector<HTMLElement>('[data-menu]');
const menuLinks = menuOverlay?.querySelectorAll<HTMLAnchorElement>('a');

function openMenu(): void {
  menuOverlay?.classList.add('is-open');
  menuToggles.forEach((toggle) => toggle.setAttribute('aria-expanded', 'true'));
  document.body.style.overflow = 'hidden';
}

function closeMenu(): void {
  menuOverlay?.classList.remove('is-open');
  menuToggles.forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
  document.body.style.overflow = '';
}

menuToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const open = menuOverlay?.classList.contains('is-open');
    if (open) closeMenu();
    else openMenu();
  });
});
menuLinks?.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (revealElements.length && !reducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal', 'is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  revealElements.forEach((element) => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

if (!reducedMotion) {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((element) => {
    const label = element.textContent ?? '';
    element.setAttribute('aria-label', label);
    element.textContent = '';
    label.split(/(\s+)/).forEach((part) => {
      if (/^\s+$/.test(part)) {
        element.appendChild(document.createTextNode(part));
      } else {
        const word = document.createElement('span');
        word.className = 'split-word';
        word.textContent = part;
        element.appendChild(word);
      }
    });
    const splitObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add('is-split');
            splitObserver.unobserve(element);
          }
        });
      },
      { threshold: 0.4 },
    );
    splitObserver.observe(element);
  });
}

function animateCounter(element: HTMLElement): void {
  const target = Number(element.dataset.counter ?? '0');
  const suffix = element.dataset.suffix ?? '';
  const duration = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = `${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
if (counters.length && !reducedMotion) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.textContent = `0${target.dataset.suffix ?? ''}`;
          animateCounter(target);
          counterObserver.unobserve(target);
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((counter) => counterObserver.observe(counter));
}

const carousels = document.querySelectorAll<HTMLElement>('[data-carousel]');
carousels.forEach((carousel) => {
  const track = carousel.querySelector<HTMLElement>('[data-carousel-track]');
  const prev = carousel.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = carousel.querySelector<HTMLButtonElement>('[data-carousel-next]');
  if (!track) return;
  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev?.setAttribute('aria-disabled', String(track.scrollLeft <= 0));
    next?.setAttribute('aria-disabled', String(track.scrollLeft >= maxScroll - 1));
  };
  const scrollBySlide = (direction: number) => {
    const slide = track.querySelector<HTMLElement>('[data-carousel-slide]');
    const amount = slide?.getBoundingClientRect().width ?? track.clientWidth;
    track.scrollBy({ left: amount * direction, behavior: reducedMotion ? 'auto' : 'smooth' });
  };
  prev?.addEventListener('click', () => scrollBySlide(-1));
  next?.addEventListener('click', () => scrollBySlide(1));
  track.addEventListener('scroll', updateButtons, { passive: true });
  updateButtons();
});

const faqItems = document.querySelectorAll<HTMLButtonElement>('[data-faq-toggle]');
faqItems.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const item = toggle.closest<HTMLElement>('[data-faq-item]');
    if (!item) return;
    const isOpen = item.classList.contains('is-open');
    item.classList.toggle('is-open', !isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
});

const loadMoreButton = document.querySelector<HTMLButtonElement>('[data-load-more]');
const loadMoreItems = document.querySelectorAll<HTMLElement>('[data-load-more-item]');
let visibleLoadMore = 0;
const step = 3;
if (loadMoreButton && loadMoreItems.length) {
  loadMoreItems.forEach((item) => item.classList.add('is-hidden'));
  const revealBatch = () => {
    const batch = Array.from(loadMoreItems).slice(visibleLoadMore, visibleLoadMore + step);
    batch.forEach((item) => item.classList.remove('is-hidden'));
    visibleLoadMore += batch.length;
    if (visibleLoadMore >= loadMoreItems.length) loadMoreButton.hidden = true;
  };
  loadMoreButton.addEventListener('click', revealBatch);
}

const gallery = document.querySelector<HTMLElement>('[data-gallery]');
if (gallery) {
  const lightbox = document.querySelector<HTMLElement>('[data-lightbox]');
  const lightboxImage = lightbox?.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const lightboxClose = lightbox?.querySelector<HTMLButtonElement>('[data-lightbox-close]');
  const lightboxPrev = lightbox?.querySelector<HTMLButtonElement>('[data-lightbox-prev]');
  const lightboxNext = lightbox?.querySelector<HTMLButtonElement>('[data-lightbox-next]');
  const items = Array.from(gallery.querySelectorAll<HTMLElement>('[data-gallery-item]'));
  let current = 0;
  const openLightbox = (index: number) => {
    current = index;
    if (lightboxImage) {
      const img = items[current].querySelector<HTMLImageElement>('img');
      if (img) {
        lightboxImage.src = img.currentSrc || img.src;
        lightboxImage.alt = img.alt;
      }
    }
    lightbox?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox?.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  const moveLightbox = (direction: number) => {
    openLightbox((current + direction + items.length) % items.length);
  };
  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => moveLightbox(-1));
  lightboxNext?.addEventListener('click', () => moveLightbox(1));
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (!lightbox?.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });
}