const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

const setHeaderState = () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const setMenuOpen = (isOpen) => {
  menu?.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'סגירת תפריט' : 'פתיחת תפריט');
  document.body.classList.toggle('menu-open', isOpen);
};

menuToggle?.addEventListener('click', () => {
  setMenuOpen(!menu.classList.contains('open'));
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !menu?.classList.contains('open')) return;
  setMenuOpen(false);
  menuToggle?.focus();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll('[data-accordion] details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('[data-accordion] details').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});

const form = document.querySelector('[data-whatsapp-form]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const lines = [
    'שלום נתנאל, הגעתי דרך האתר ואשמח לבדוק זמינות.',
    '',
    `שם: ${data.get('name')}`,
    `טלפון: ${data.get('phone')}`,
    `סוג האירוע: ${data.get('event')}`,
    `עיר: ${data.get('city') || 'טרם נקבעה'}`,
    `תאריך משוער: ${data.get('date') || 'טרם נקבע'}`,
    `פרטים נוספים: ${data.get('message') || 'אין כרגע'}`
  ];

  const whatsappUrl = `https://wa.me/972523366442?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

document.querySelectorAll('[data-year]').forEach((item) => {
  item.textContent = new Date().getFullYear();
});
