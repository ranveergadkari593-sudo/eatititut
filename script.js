gsap.registerPlugin(ScrollTrigger);

const slides = gsap.utils.toArray('.story-slide');
const bgImages = gsap.utils.toArray('.bg-image');
const cards = gsap.utils.toArray('.story-slide .slide-card');
const slideCounter = document.getElementById('slideCounter');
let storyTrigger = null;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setActiveSlide(index) {
  if (slideCounter) {
    slideCounter.textContent = `${String(index + 1).padStart(2, '0')} / 03`;
  }
}

if (!reducedMotion) {
  gsap.set(slides, {
    position: 'absolute',
    inset: 0,
    opacity: 0,
    yPercent: 8,
    scale: 0.985,
    filter: 'blur(8px)'
  });
  gsap.set(bgImages, {
    scale: 1.1,
    transformOrigin: 'center center'
  });
  gsap.set(cards, {
    opacity: 0,
    x: -18,
    y: 10
  });
  gsap.set(slides[0], {
    opacity: 1,
    yPercent: 0,
    scale: 1,
    filter: 'blur(0px)'
  });
  gsap.set(bgImages[0], { scale: 1.02 });
  gsap.set(cards[0], { opacity: 1, x: 0, y: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      id: 'story',
      trigger: '#story',
      start: 'top top',
      end: () => `+=${window.innerHeight * (slides.length - 1) * 1.55}`,
      pin: true,
      scrub: 1.35,
      anticipatePin: 1,
      onUpdate: (self) => {
        const index = Math.min(slides.length - 1, Math.floor(self.progress * slides.length + 0.02));
        setActiveSlide(index);
      }
    },
    defaults: { ease: 'power2.inOut' }
  });

  const slideOutY = -10;
  const bgMidScale = 1.14;
  const bgNextScale = 1.06;
  const cardExitX = -24;
  const cardExitY = -6;

  tl.to(slides[0], { opacity: 0, yPercent: slideOutY, scale: 0.985, filter: 'blur(8px)', duration: 1.15 }, 0)
    .to(slides[1], { opacity: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: 1.15 }, 0.18)
    .to(bgImages[0], { scale: bgMidScale, duration: 1.25 }, 0)
    .to(bgImages[1], { scale: bgNextScale, duration: 1.25 }, 0.15)
    .to(cards[0], { opacity: 0, x: cardExitX, y: cardExitY, duration: 1.05 }, 0)
    .to(cards[1], { opacity: 1, x: 0, y: 0, duration: 1.05 }, 0.2)
    .to(slides[1], { opacity: 0, yPercent: slideOutY, scale: 0.985, filter: 'blur(8px)', duration: 1.15 }, 1)
    .to(slides[2], { opacity: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: 1.15 }, 1.18)
    .to(bgImages[1], { scale: bgMidScale, duration: 1.25 }, 1)
    .to(bgImages[2], { scale: bgNextScale, duration: 1.25 }, 1.15)
    .to(cards[1], { opacity: 0, x: cardExitX, y: cardExitY, duration: 1.05 }, 1)
    .to(cards[2], { opacity: 1, x: 0, y: 0, duration: 1.05 }, 1.2);

  storyTrigger = tl.scrollTrigger;
  setActiveSlide(0);
} else {
  slides.forEach((slide) => {
    slide.style.position = 'relative';
    slide.style.opacity = '1';
    slide.style.transform = 'none';
  });
}

const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const jumpers = gsap.utils.toArray('[data-jump-slide]');
let menuOpen = false;

function goToSlide(index) {
  if (storyTrigger) {
    const target = Math.max(0, Math.min(1, index / Math.max(1, slides.length - 1)));
    const top = storyTrigger.start + ((storyTrigger.end - storyTrigger.start) * target);
    window.scrollTo({ top, behavior: 'smooth' });
    return;
  }
  slides[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openMenu() {
  if (!menuOverlay || menuOpen) return;
  menuOpen = true;
  document.body.style.overflow = 'hidden';
  menuToggle?.setAttribute('aria-expanded', 'true');
  gsap.set(menuOverlay, { pointerEvents: 'auto' });
  gsap.to(menuOverlay, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' });
  gsap.fromTo(menuOverlay.querySelector('nav'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
}

function closeMenu() {
  if (!menuOverlay || !menuOpen) return;
  menuOpen = false;
  document.body.style.overflow = '';
  menuToggle?.setAttribute('aria-expanded', 'false');
  gsap.to(menuOverlay, {
    autoAlpha: 0,
    duration: 0.22,
    ease: 'power2.in',
    onComplete: () => gsap.set(menuOverlay, { pointerEvents: 'none' })
  });
}

menuToggle?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
menuOverlay?.addEventListener('click', (event) => {
  if (event.target === menuOverlay) closeMenu();
});
jumpers.forEach((item) => {
  item.addEventListener('click', () => {
    const index = Number(item.getAttribute('data-jump-slide') || 0);
    closeMenu();
    goToSlide(index);
  });
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

ScrollTrigger.refresh();
window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });
