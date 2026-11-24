const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const data = new FormData(bookingForm);
  const message = [
    'Hello Zoha Tours, I would like to make a booking enquiry.',
    '',
    `Name: ${data.get('name')}`,
    `Pick-up: ${data.get('pickup')}`,
    `Destination: ${data.get('destination')}`,
    `Travel date: ${data.get('date')}`,
    `Passengers: ${data.get('passengers')}`,
    `Service: ${data.get('service')}`,
    data.get('details') ? `Additional details: ${data.get('details')}` : ''
  ].filter(Boolean).join('\n');

  window.open(`https://wa.me/97333094308?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

// Auto-advancing, touch-friendly vehicle carousel
const fleetWindow = document.getElementById('fleetWindow');
const fleetTrack = document.getElementById('fleetTrack');
if (fleetWindow && fleetTrack) {
  const fleetStep = () => {
    const card = fleetTrack.querySelector('.vehicle-card');
    return card ? card.getBoundingClientRect().width + 18 : 320;
  };
  const moveFleet = direction => {
    const max = fleetWindow.scrollWidth - fleetWindow.clientWidth;
    if (direction > 0 && fleetWindow.scrollLeft >= max - 8) fleetWindow.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction < 0 && fleetWindow.scrollLeft <= 8) fleetWindow.scrollTo({ left: max, behavior: 'smooth' });
    else fleetWindow.scrollBy({ left: direction * fleetStep(), behavior: 'smooth' });
  };
  document.getElementById('fleetNext')?.addEventListener('click', () => moveFleet(1));
  document.getElementById('fleetPrev')?.addEventListener('click', () => moveFleet(-1));
  let fleetTimer = setInterval(() => moveFleet(1), 3500);
  const pauseFleet = () => { clearInterval(fleetTimer); };
  const resumeFleet = () => { clearInterval(fleetTimer); fleetTimer = setInterval(() => moveFleet(1), 3500); };
  fleetWindow.addEventListener('mouseenter', pauseFleet);
  fleetWindow.addEventListener('mouseleave', resumeFleet);
  fleetWindow.addEventListener('touchstart', pauseFleet, { passive: true });
  fleetWindow.addEventListener('touchend', resumeFleet, { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? pauseFleet() : resumeFleet());
}

// Filter cards without changing their booking links or carousel behavior.
const fleetFilters = document.querySelectorAll('.fleet-filter');
const vehicleCards = [...document.querySelectorAll('#fleetTrack .vehicle-card')];
const fleetResults = document.getElementById('fleetResults');
let activeSeats = 'all';
fleetFilters.forEach(button => button.addEventListener('click', () => {
  activeSeats = button.dataset.seats;
  fleetFilters.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  vehicleCards.forEach(card => {
    const seats = card.querySelector('.vehicle-meta span')?.textContent.trim().split(' ')[0];
    card.hidden = activeSeats !== 'all' && seats !== activeSeats;
    if (!card.hidden) count++;
  });
  if (fleetResults) fleetResults.textContent = `SHOWING ${count} ${count === 1 ? 'VEHICLE' : 'VEHICLES'}${activeSeats === 'all' ? '' : ` · ${activeSeats} SEATS`}`;
  fleetWindow?.scrollTo({ left: 0, behavior: 'instant' });
}));

// Auto-scrolling bilingual guest reviews. Pauses while visitors interact.
const testimonialSlider = document.getElementById('testimonialSlider');
const testimonialTrack = document.getElementById('testimonialTrack');
if (testimonialSlider && testimonialTrack) {
  let testimonialTimer;
  const reviewStep = () => {
    const card = testimonialTrack.querySelector('.testimonial-card');
    return card ? card.getBoundingClientRect().width + 16 : 340;
  };
  const nextReview = direction => {
    const max = testimonialTrack.scrollWidth - testimonialSlider.clientWidth;
    const current = testimonialSlider.scrollLeft;
    if (direction > 0 && current >= max - 8) testimonialSlider.scrollTo({left: 0, behavior: 'smooth'});
    else if (direction < 0 && current <= 8) testimonialSlider.scrollTo({left: max, behavior: 'smooth'});
    else testimonialSlider.scrollBy({left: direction * reviewStep(), behavior: 'smooth'});
  };
  const startReviewAuto = () => {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(() => nextReview(1), 4200);
  };
  const stopReviewAuto = () => clearInterval(testimonialTimer);
  document.getElementById('testimonialNext')?.addEventListener('click', () => { nextReview(1); startReviewAuto(); });
  document.getElementById('testimonialPrev')?.addEventListener('click', () => { nextReview(-1); startReviewAuto(); });
  testimonialSlider.addEventListener('mouseenter', stopReviewAuto);
  testimonialSlider.addEventListener('mouseleave', startReviewAuto);
  testimonialSlider.addEventListener('touchstart', stopReviewAuto, {passive:true});
  testimonialSlider.addEventListener('touchend', startReviewAuto, {passive:true});
  document.addEventListener('visibilitychange', () => document.hidden ? stopReviewAuto() : startReviewAuto());
  startReviewAuto();
}
