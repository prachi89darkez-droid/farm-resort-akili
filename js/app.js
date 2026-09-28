/**
 * ==========================================================================
 * LuxeStay Atithi Niwas - Public Application Logic
 * Upgraded: Standard Date-Based Availability Engine
 * ==========================================================================
 */

import { 
  propertyInfo, 
  propertyFacilities, 
  galleryItems 
} from './data.js';

import { 
  getCottages, 
  getHalls,
  getAvailabilityForDateRange, 
  getMenuData, 
  createBookingRequest, 
  getSavedCottages, 
  toggleSaveCottage 
} from './store.js';

// ==========================================================================
// Central State
// ==========================================================================

const state = {
  // Selected stay dates for availability calculation
  checkIn: '',
  checkOut: '',
  activeMenuTab: 'today',
  activeModalCottageId: null,
  activeLightboxIndex: 0
};

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initDefaultDates();
  initDateListeners();
  initNavigation();
  initMenuTabs();
  initBookingForm();
  initModalListeners();
  initLightboxListeners();

  // Initial Date-Based Evaluation
  evaluateDateAvailability();

  // Render static/semi-static sections
  renderMenu(state.activeMenuTab);
  renderFacilities();
  renderGallery();
  updateSavedBadges();
});

// Currency formatting helper
function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Format Date object to YYYY-MM-DD
function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function nextDate(dateString) {
  const day = new Date(`${dateString}T00:00:00`);
  day.setDate(day.getDate() + 1);
  return formatDate(day);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

// ==========================================================================
// 1. Date Synchronization & Controls
// ==========================================================================

function initDefaultDates() {
  const today = new Date();
  
  // Default to 2026-10-01 or today+4 days for clear demonstration
  const defaultIn = new Date(today);
  defaultIn.setDate(today.getDate() + 4);

  const defaultOut = new Date(defaultIn);
  defaultOut.setDate(defaultIn.getDate() + 3);

  state.checkIn = formatDate(defaultIn);
  state.checkOut = formatDate(defaultOut);

  // Sync with Availability filter form
  const availIn = document.getElementById('avail-checkin');
  const availOut = document.getElementById('avail-checkout');
  if (availIn && availOut) {
    availIn.min = formatDate(today);
    availIn.value = state.checkIn;
    availOut.min = formatDate(new Date(defaultIn.getTime() + 86400000));
    availOut.value = state.checkOut;
  }

  // Sync with Booking form
  const bookIn = document.getElementById('book-checkin');
  const bookOut = document.getElementById('book-checkout');
  if (bookIn && bookOut) {
    bookIn.min = formatDate(today);
    bookIn.value = state.checkIn;
    bookOut.min = formatDate(new Date(defaultIn.getTime() + 86400000));
    bookOut.value = state.checkOut;
  }
  document.getElementById('book-event-date').min = formatDate(today);
}

function initDateListeners() {
  const availForm = document.getElementById('avail-date-filter-form');
  const availIn = document.getElementById('avail-checkin');
  const availOut = document.getElementById('avail-checkout');

  const bookIn = document.getElementById('book-checkin');
  const bookOut = document.getElementById('book-checkout');

  // When Availability section form is submitted
  if (availForm) {
    availForm.addEventListener('submit', (e) => {
      e.preventDefault();
      updateDates(availIn.value, availOut.value);
    });
  }

  if (availIn && availOut) {
    availIn.addEventListener('change', () => {
      const nextDay = new Date(availIn.value);
      nextDay.setDate(nextDay.getDate() + 1);
      availOut.min = formatDate(nextDay);
      if (availOut.value <= availIn.value) {
        availOut.value = formatDate(nextDay);
      }
      updateDates(availIn.value, availOut.value);
    });

    availOut.addEventListener('change', () => {
      updateDates(availIn.value, availOut.value);
    });
  }

  // When dates change in the booking form
  if (bookIn && bookOut) {
    bookIn.addEventListener('change', () => {
      const nextDay = new Date(bookIn.value);
      nextDay.setDate(nextDay.getDate() + 1);
      bookOut.min = formatDate(nextDay);
      if (bookOut.value <= bookIn.value) {
        bookOut.value = formatDate(nextDay);
      }
      updateDates(bookIn.value, bookOut.value);
    });

    bookOut.addEventListener('change', () => {
      updateDates(bookIn.value, bookOut.value);
    });
  }
}

function updateDates(checkIn, checkOut) {
  state.checkIn = checkIn;
  state.checkOut = checkOut;

  // Keep both forms synchronized
  const availIn = document.getElementById('avail-checkin');
  const availOut = document.getElementById('avail-checkout');
  const bookIn = document.getElementById('book-checkin');
  const bookOut = document.getElementById('book-checkout');

  if (availIn && availIn.value !== checkIn) availIn.value = checkIn;
  if (availOut && availOut.value !== checkOut) availOut.value = checkOut;
  if (bookIn && bookIn.value !== checkIn) bookIn.value = checkIn;
  if (bookOut && bookOut.value !== checkOut) bookOut.value = checkOut;

  evaluateDateAvailability();
}

// ==========================================================================
// 2. Date-Based Availability Calculation & UI Rendering
// ==========================================================================

export function evaluateDateAvailability() {
  if (!state.checkIn || !state.checkOut) return;

  // Calculate live availability for the exact selected date range
  const result = getAvailabilityForDateRange(state.checkIn, state.checkOut);

  // Update Headline Text as requested
  const headlineEl = document.getElementById('avail-headline-text');
  const datesBadge = document.getElementById('avail-dates-badge');

  if (headlineEl) {
    headlineEl.textContent = `${result.availableCount} of ${result.total} cottages available for your selected dates.`;
  }

  if (datesBadge) {
    const d1 = new Date(state.checkIn).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    const d2 = new Date(state.checkOut).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    datesBadge.textContent = `${d1} → ${d2}`;
  }

  // Update Summary Metric Cards
  const totalCountEl = document.getElementById('summary-total-count');
  const availCountEl = document.getElementById('summary-available-count');
  const bookedCountEl = document.getElementById('summary-booked-count');

  if (totalCountEl) totalCountEl.textContent = result.total;
  if (availCountEl) availCountEl.textContent = result.availableCount;
  if (bookedCountEl) bookedCountEl.textContent = result.bookedCount;

  // Render Cottage Status Cards in Availability Section
  renderAvailabilityCards(result.cottages);

  // Render 5 Cottages Catalog
  renderCottagesCatalog(result.cottages);

  // Update Booking Form Dropdown with available options
  populateBookingCottageDropdown(result.cottages);
}

function renderAvailabilityCards(cottages) {
  const gridEl = document.getElementById('availability-status-grid');
  if (!gridEl) return;

  gridEl.innerHTML = cottages.map(c => {
    const isAvail = c.isAvailableForDates;
    const conflict = c.conflicts && c.conflicts[0];

    return `
      <div class="cottage-status-box ${isAvail ? 'is-available' : 'is-booked'}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
          <div>
            <span style="font-size: 0.72rem; font-weight: bold; color: var(--color-text-muted); text-transform: uppercase;">
              Cottage ${c.number}
            </span>
            <h4 style="font-size: 1.05rem; margin-top: 2px; color: var(--color-text-primary);">
              ${c.name.split('—')[1] || c.name}
            </h4>
          </div>
          <span class="status-pill ${isAvail ? 'status-available' : 'status-booked'}">
            <span class="status-dot"></span>
            ${isAvail ? 'Available' : 'Booked'}
          </span>
        </div>

        <div style="font-size: 0.82rem; color: var(--color-text-secondary); line-height: 1.5;">
          ${isAvail 
            ? `🟢 <strong>Available</strong> for your selected dates.`
            : `🔴 <strong>Reserved</strong> (${conflict ? `${conflict.checkIn} to ${conflict.checkOut}` : 'Overlapping booking'}).`
          }
        </div>

        <div style="margin-top: 4px;">
          ${isAvail 
            ? `<button type="button" class="btn btn-outline btn-sm quick-book-btn" data-cottage-id="${c.id}" style="width: 100%;">
                 Book for These Dates
               </button>`
            : `<button type="button" class="btn btn-ghost btn-sm" disabled style="width: 100%; opacity: 0.55; cursor: not-allowed; border: 1px solid var(--color-border-subtle);">
                 Unavailable for These Dates
               </button>`
          }
        </div>
      </div>
    `;
  }).join('');

  gridEl.querySelectorAll('.quick-book-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-cottage-id');
      selectCottageInForm(id);
    });
  });
}

function renderCottagesCatalog(cottages) {
  const container = document.getElementById('cottages-grid');
  if (!container) return;

  const savedIds = getSavedCottages();

  container.innerHTML = cottages.map(c => {
    const isSaved = savedIds.includes(c.id);
    const isAvail = c.isAvailableForDates;

    return `
      <article class="room-card" data-cottage-id="${c.id}">
        
        <div class="room-card-image-box">
          <img src="${c.image}" alt="${c.name}" class="room-card-image" loading="lazy" />
          
          <span class="status-pill ${isAvail ? 'status-available' : 'status-booked'} room-card-badge" style="background: rgba(255, 255, 255, 0.95);">
            <span class="status-dot"></span>
            ${isAvail ? 'Available for Dates' : 'Booked for Dates'}
          </span>

          <button 
            type="button" 
            class="room-fav-btn ${isSaved ? 'favorited' : ''}" 
            data-cottage-id="${c.id}"
            aria-pressed="${isSaved}"
            title="${isSaved ? 'Remove from Saved' : 'Save this Cottage'}"
            aria-label="Save ${c.name}"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="${isSaved ? '#C0392B' : 'none'}">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div class="room-card-body">
          <div class="room-category-meta">
            <span>Unit ${c.number}</span>
            <span>👥 Max ${c.maxGuests} Guests</span>
          </div>

          <h3 class="room-card-title">${c.name}</h3>

          <p class="room-card-tagline">${c.tagline}</p>

          <div class="room-specs-strip">
            <div class="room-spec-item">
              <span>🛏️</span>
              <span>${c.bedInfo}</span>
            </div>
            <div class="room-spec-item">
              <span>🚿</span>
              <span>Attached Bath &amp; Geyser</span>
            </div>
          </div>

          <div class="room-card-footer">
            <div class="room-price-box">
              <span class="room-price-val">${formatINR(c.pricePerNight)}</span>
              <span class="room-price-period">per night + GST</span>
            </div>

            <div style="display: flex; gap: 8px;">
              <button 
                type="button" 
                class="btn btn-outline btn-sm cottage-details-btn" 
                data-cottage-id="${c.id}"
              >
                Details
              </button>

              <button 
                type="button" 
                class="btn ${isAvail ? 'btn-primary' : 'btn-dark'} btn-sm cottage-book-btn" 
                data-cottage-id="${c.id}"
              >
                ${isAvail ? 'Book' : 'Check'}
              </button>
            </div>
          </div>

        </div>

      </article>
    `;
  }).join('');

  container.querySelectorAll('.room-fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = e.currentTarget.getAttribute('data-cottage-id');
      toggleSaveCottage(id);
      evaluateDateAvailability();
      updateSavedBadges();
    });
  });

  container.querySelectorAll('.cottage-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-cottage-id');
      openCottageModal(id);
    });
  });

  container.querySelectorAll('.cottage-book-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-cottage-id');
      selectCottageInForm(id);
    });
  });
}

function updateSavedBadges() {
  const saved = getSavedCottages();
  const count = saved.length;
  const badge = document.getElementById('header-saved-count');
  if (badge) badge.textContent = count;
}

// ==========================================================================
// 3. Dynamic Cottage Dropdown in Booking Form
// ==========================================================================

function populateBookingCottageDropdown(cottages) {
  const select = document.getElementById('book-cottage');
  if (!select) return;

  const currentSelection = select.value;
  const hasAvailable = cottages.some(c => c.isAvailableForDates);

  select.innerHTML = `
    <option value="" disabled ${!currentSelection ? 'selected' : ''}>
       ${hasAvailable ? '-- Select Available Accommodation --' : '-- No Accommodations Available for These Dates --'}
    </option>
    ${cottages.map(c => {
      const isAvail = c.isAvailableForDates;
      return `
        <option value="${c.id}" ${!isAvail ? 'disabled' : ''} ${currentSelection === c.id ? 'selected' : ''}>
           ${escapeHtml(c.name)} (${formatINR(c.pricePerNight)}/night) ${isAvail ? '— [AVAILABLE]' : '— [UNAVAILABLE FOR DATES]'}
        </option>
      `;
    }).join('')}
  `;
}

function selectCottageInForm(cottageId) {
  document.getElementById('book-type').value = 'accommodation';
  document.getElementById('book-type').dispatchEvent(new Event('change'));
  const select = document.getElementById('book-cottage');
  if (select) {
    select.value = cottageId;
  }
  const formSection = document.getElementById('booking-section');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==========================================================================
// 4. Booking Submission with Real-Time Conflict Prevention
// ==========================================================================

function initBookingForm() {
  const form = document.getElementById('public-booking-form');
  const alertEl = document.getElementById('booking-alert');
  const modal = document.getElementById('booking-confirmation-modal');
  const closeBtn = document.getElementById('confirm-close-btn');
  const printBtn = document.getElementById('confirm-print-btn');

  if (!form) return;

  const typeSelect = document.getElementById('book-type');
  const accommodationFields = document.getElementById('accommodation-fields');
  const hallFields = document.getElementById('hall-fields');
  const eventDate = document.getElementById('book-event-date');
  const guestList = document.getElementById('book-other-guests');
  const addGuestButton = document.getElementById('book-add-guest');
  let guestIndex = 0;

  typeSelect.addEventListener('change', () => {
    const isHall = typeSelect.value === 'hall';
    accommodationFields.hidden = isHall;
    hallFields.hidden = !isHall;
    eventDate.required = isHall;
    for (const id of ['book-checkin', 'book-checkout', 'book-cottage', 'book-guests']) {
      document.getElementById(id).required = !isHall;
    }
    if (alertEl) alertEl.style.display = 'none';
  });

  addGuestButton.addEventListener('click', () => {
    guestIndex++;
    const row = document.createElement('div');
    row.className = 'guest-row';
    row.innerHTML = `
      <div class="form-group">
        <label for="other-guest-name-${guestIndex}" class="form-label">Full Name <span class="req">*</span></label>
        <input id="other-guest-name-${guestIndex}" class="form-input other-guest-name" type="text" maxlength="120" required>
      </div>
      <div class="form-group">
        <label for="other-guest-age-${guestIndex}" class="form-label">Age <span class="req">*</span></label>
        <input id="other-guest-age-${guestIndex}" class="form-input other-guest-age" type="number" min="1" max="120" step="1" required>
      </div>
      <button type="button" class="btn-remove-guest" aria-label="Remove guest ${guestIndex}">Remove</button>
    `;
    row.querySelector('.btn-remove-guest').addEventListener('click', () => row.remove());
    guestList.insertBefore(row, addGuestButton);
    row.querySelector('input').focus();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (alertEl) alertEl.style.display = 'none';

    const isHall = typeSelect.value === 'hall';
    const name = document.getElementById('book-name').value.trim();
    const age = Number(document.getElementById('book-age').value);
    const address = document.getElementById('book-address').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const altPhone = document.getElementById('book-alt-phone').value.trim();
    const email = document.getElementById('book-email').value.trim();
    const cottageId = isHall ? 'hall-1' : document.getElementById('book-cottage').value;
    const checkIn = isHall ? eventDate.value : document.getElementById('book-checkin').value;
    const checkOut = isHall && checkIn ? nextDate(checkIn) : document.getElementById('book-checkout').value;
    const guestsCount = isHall ? 1 + guestList.querySelectorAll('.guest-row').length : Number(document.getElementById('book-guests').value);
    const meals = isHall ? 'No Meals' : document.getElementById('book-meals').value;
    const specialRequest = document.getElementById('book-notes').value.trim();
    const otherGuests = [...guestList.querySelectorAll('.guest-row')].map(row => ({
      name: row.querySelector('.other-guest-name').value.trim(),
      age: Number(row.querySelector('.other-guest-age').value)
    }));

    if (!name || !address || !phone || !altPhone || !cottageId || !checkIn || !checkOut || !Number.isInteger(age) || age < 1 || age > 120) {
      showError('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }
    if (otherGuests.some(guest => !guest.name || !Number.isInteger(guest.age) || guest.age < 1 || guest.age > 120)) {
      showError('Please enter a full name and a valid age (1–120) for each other guest, or remove an empty row.');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone) || !/^[0-9]{10}$/.test(altPhone)) {
      showError('Please enter two valid 10-digit phone numbers.');
      return;
    }
    if (email && !document.getElementById('book-email').checkValidity()) {
      showError('Please enter a valid email address or leave it blank.');
      return;
    }
    const today = formatDate(new Date());
    if (checkIn < today || (!isHall && checkOut <= checkIn) || !form.querySelector(isHall ? '#book-event-date' : '#book-checkin').validity.valid || (!isHall && !document.getElementById('book-checkout').validity.valid)) {
      showError(isHall ? 'Please choose a valid event date today or later.' : 'Please choose valid dates today or later, with check-out after check-in.');
      return;
    }
    const selectedUnit = (isHall ? getHalls() : getCottages()).find(unit => unit.id === cottageId);
    if (!selectedUnit) {
      showError('Selected unit not found. Please refresh and try again.');
      return;
    }
    if (!isHall && guestsCount > selectedUnit.maxGuests) {
      showError(`${selectedUnit.name} accommodates at most ${selectedUnit.maxGuests} guests. Please choose fewer guests or another accommodation.`);
      return;
    }
    if (otherGuests.length + 1 > guestsCount || (isHall && guestsCount > selectedUnit.maxGuests)) {
      showError('The guest list exceeds the selected guest count or hall capacity.');
      return;
    }

    const result = createBookingRequest({
      bookingType: isHall ? 'hall' : 'accommodation',
      guestName: name,
      guestAge: age,
      address,
      phone,
      altPhone,
      email,
      otherGuests,
      cottageId,
      cottageName: selectedUnit.name,
      checkIn,
      checkOut,
      guestsCount,
      cottageCount: isHall ? 0 : 1,
      meals,
      specialRequest
    });

    if (!result.success) {
      showError(`Booking Overlap Conflict: ${result.error}`);
      return;
    }

    evaluateDateAvailability();

    showConfirmationModal(result.booking, selectedUnit);
    form.reset();
    guestList.querySelectorAll('.guest-row').forEach(row => row.remove());
    typeSelect.dispatchEvent(new Event('change'));

    // Restore synchronized dates
    document.getElementById('book-checkin').value = state.checkIn;
    document.getElementById('book-checkout').value = state.checkOut;
  });

  function showError(msg) {
    if (alertEl) {
      alertEl.textContent = msg;
      alertEl.style.display = 'flex';
      alertEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert(msg);
    }
  }

  function showConfirmationModal(booking, unit) {
    const table = document.getElementById('confirmation-details-table');
    if (table) {
      const isHall = booking.bookingType === 'hall';
      const diffDays = Math.round((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000);
      const totalEstimated = (isHall ? unit.pricePerDay : unit.pricePerNight) * diffDays;

      table.innerHTML = `
        <tr>
          <td>Booking Reference</td>
          <td><strong style="color: var(--color-gold-dark);">${booking.id}</strong></td>
        </tr>
        <tr>
          <td>Primary Guest</td>
          <td><strong>${escapeHtml(booking.guestName)}</strong> (${escapeHtml(booking.phone)})</td>
        </tr>
        <tr>
          <td>Reserved Unit</td>
          <td>${escapeHtml(unit.name)}</td>
        </tr>
        <tr>
          <td>${isHall ? 'Event Date' : 'Stay Duration'}</td>
          <td>${isHall ? booking.checkIn : `${booking.checkIn} to ${booking.checkOut} (${diffDays} Night${diffDays > 1 ? 's' : ''})`}</td>
        </tr>
        <tr>
          <td>Guests &amp; Units</td>
          <td>${booking.guestsCount} ${isHall ? 'Attendee(s)' : 'Guest(s) · 1 Accommodation'}</td>
        </tr>
        <tr>
          <td>Meal Preference</td>
          <td>${escapeHtml(booking.meals)}</td>
        </tr>
        <tr>
          <td>Est. ${isHall ? 'Hall' : 'Accommodation'} Tariff</td>
          <td><strong>${formatINR(totalEstimated)}</strong> + GST (Payable at front desk)</td>
        </tr>
        <tr>
          <td>Booking Status</td>
          <td><span class="status-pill status-available">${booking.status}</span></td>
        </tr>
      `;
    }

    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// ==========================================================================
// 5. Dining Menu Section
// ==========================================================================

function initMenuTabs() {
  const todayBtn = document.getElementById('tab-today-btn');
  const tomorrowBtn = document.getElementById('tab-tomorrow-btn');

  if (todayBtn && tomorrowBtn) {
    todayBtn.addEventListener('click', () => {
      state.activeMenuTab = 'today';
      todayBtn.classList.add('active');
      tomorrowBtn.classList.remove('active');
      renderMenu('today');
    });

    tomorrowBtn.addEventListener('click', () => {
      state.activeMenuTab = 'tomorrow';
      tomorrowBtn.classList.add('active');
      todayBtn.classList.remove('active');
      renderMenu('tomorrow');
    });
  }
}

export function renderMenu(dayKey = 'today') {
  const menuData = getMenuData();
  const currentDay = menuData[dayKey];
  const gridEl = document.getElementById('menu-courses-grid');
  const badgeEl = document.getElementById('menu-date-badge');

  if (badgeEl && currentDay) {
    badgeEl.textContent = `${currentDay.dayLabel} &bull; ${currentDay.dateText}`;
  }

  if (!gridEl || !currentDay) return;

  const courses = [
    { key: 'breakfast', title: 'Morning Breakfast', icon: '🍲', timing: '7:30 AM – 9:30 AM' },
    { key: 'lunch', title: 'Afternoon Lunch (Thali)', icon: '🍛', timing: '12:30 PM – 2:30 PM' },
    { key: 'snacks', title: 'Evening Refreshments', icon: '☕', timing: '4:30 PM – 6:00 PM' },
    { key: 'dinner', title: 'Night Dinner (Thali)', icon: '🍽️', timing: '8:00 PM – 10:00 PM' }
  ];

  gridEl.innerHTML = courses.map(course => {
    const items = currentDay[course.key] || [];

    return `
      <div class="meal-course-card">
        <div class="meal-course-header">
          <span class="meal-icon">${course.icon}</span>
          <div>
            <h3 class="meal-name">${course.title}</h3>
            <span style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">
              ${course.timing}
            </span>
          </div>
        </div>

        <ul class="meal-items-list">
          ${items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// 6. Cottage Detail Modal
// ==========================================================================

function initModalListeners() {
  const modalBackdrop = document.getElementById('room-detail-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const bookCta = document.getElementById('modal-book-cta-btn');
  const favBtn = document.getElementById('modal-fav-btn');

  if (!modalBackdrop) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCottageModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeCottageModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeCottageModal();
    }
  });

  if (bookCta) {
    bookCta.addEventListener('click', () => {
      const id = state.activeModalCottageId;
      closeCottageModal();
      if (id) selectCottageInForm(id);
    });
  }

  if (favBtn) {
    favBtn.addEventListener('click', () => {
      if (state.activeModalCottageId) {
        toggleSaveCottage(state.activeModalCottageId);
        updateModalFavButton(state.activeModalCottageId);
        evaluateDateAvailability();
        updateSavedBadges();
      }
    });
  }
}

function openCottageModal(cottageId) {
  const cottages = getCottages();
  const c = cottages.find(item => item.id === cottageId);
  if (!c) return;

  state.activeModalCottageId = cottageId;
  const modalBackdrop = document.getElementById('room-detail-modal');
  const content = document.getElementById('modal-content');
  const priceDisplay = document.getElementById('modal-price-display');

  if (priceDisplay) priceDisplay.textContent = formatINR(c.pricePerNight);
  updateModalFavButton(cottageId);

  // Check date availability for this specific cottage
  const avail = getAvailabilityForDateRange(state.checkIn, state.checkOut);
  const matched = avail.cottages.find(item => item.id === cottageId);
  const isAvail = matched ? matched.isAvailableForDates : true;

  if (content) {
    content.innerHTML = `
      <div style="position: relative; height: 300px; background: #E8E3DA; overflow: hidden;">
        <img src="${c.image}" alt="${c.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        <span class="status-pill ${isAvail ? 'status-available' : 'status-booked'}" style="position: absolute; top: 16px; left: 16px;">
          <span class="status-dot"></span>
          ${isAvail ? 'Available for Selected Dates' : 'Booked for Selected Dates'}
        </span>
      </div>

      <div class="modal-body-padding">
        <span style="font-size: 0.76rem; font-weight: bold; color: var(--color-gold-dark); text-transform: uppercase;">
          Gram Panchayat Hospitality &bull; Unit ${c.number}
        </span>
        <h2 class="modal-room-title" style="margin-top: 4px;">${c.name}</h2>
        <p class="modal-room-tagline">${c.tagline}</p>

        <div class="modal-specs-grid">
          <div class="modal-spec-card">
            <span class="modal-spec-label">Capacity</span>
            <span class="modal-spec-value">Up to ${c.maxGuests} Guests</span>
          </div>
          <div class="modal-spec-card">
            <span class="modal-spec-label">Bed Setup</span>
            <span class="modal-spec-value">${c.bedInfo}</span>
          </div>
          <div class="modal-spec-card">
            <span class="modal-spec-label">Sanitation</span>
            <span class="modal-spec-value">Attached Bath &amp; Geyser</span>
          </div>
          <div class="modal-spec-card">
            <span class="modal-spec-label">Date Availability</span>
            <span class="modal-spec-value" style="color: ${isAvail ? '#2E7D32' : '#C62828'}; font-size: 0.85rem;">
              ${isAvail ? 'Available' : 'Booked'}
            </span>
          </div>
        </div>

        <div class="modal-description-box">
          <h4 class="modal-section-heading">Cottage Description</h4>
          <p class="modal-description-text">${c.description}</p>
        </div>

        <div class="modal-amenities-box">
          <h4 class="modal-section-heading">Cottage Amenities</h4>
          <div class="modal-amenities-grid">
            ${c.facilities.map(fac => `
              <div class="modal-amenity-item">
                <span class="modal-amenity-check">✓</span>
                <span>${fac}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (modalBackdrop) {
    modalBackdrop.classList.add('active');
    document.body.classList.add('modal-open');
  }
}

function updateModalFavButton(cottageId) {
  const favBtn = document.getElementById('modal-fav-btn');
  if (!favBtn) return;
  const isSaved = getSavedCottages().includes(cottageId);
  favBtn.innerHTML = `
    <span style="color: ${isSaved ? '#C0392B' : '#7E8B97'};">♥</span> 
    ${isSaved ? 'Saved in List' : 'Save'}
  `;
}

function closeCottageModal() {
  const modalBackdrop = document.getElementById('room-detail-modal');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('active');
  }
  document.body.classList.remove('modal-open');
  state.activeModalCottageId = null;
}

// ==========================================================================
// 7. Facilities & Gallery Renderers
// ==========================================================================

function renderFacilities() {
  const container = document.getElementById('facilities-grid');
  if (!container) return;

  container.innerHTML = propertyFacilities.map(fac => `
    <div class="facility-card">
      <div class="facility-icon-wrap">${fac.icon}</div>
      <h3 class="facility-title">${fac.title}</h3>
      <p class="facility-desc">${fac.desc}</p>
    </div>
  `).join('');
}

function renderGallery() {
  const container = document.getElementById('gallery-grid');
  if (!container) return;

  container.innerHTML = galleryItems.map((item, index) => `
    <div class="gallery-card" data-gallery-index="${index}" title="Click to view full photo">
      <img src="${item.thumb}" alt="${item.title}" loading="lazy" />
      <div class="gallery-card-overlay">
        <span class="gallery-card-cat">${item.category}</span>
        <h4 class="gallery-card-title">${item.title}</h4>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-gallery-index'), 10);
      openLightbox(idx);
    });
  });
}

function initLightboxListeners() {
  const lightbox = document.getElementById('gallery-lightbox');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  if (!lightbox) return;

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      changeLightboxImage(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      changeLightboxImage(1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') changeLightboxImage(1);
    else if (e.key === 'ArrowLeft') changeLightboxImage(-1);
  });
}

function openLightbox(index) {
  const item = galleryItems[index];
  if (!item) return;

  state.activeLightboxIndex = index;
  const lightbox = document.getElementById('gallery-lightbox');
  const imgEl = document.getElementById('lightbox-main-img');
  const titleEl = document.getElementById('lightbox-title');
  const captionEl = document.getElementById('lightbox-caption');

  if (!lightbox || !imgEl) return;

  imgEl.src = item.full;
  if (titleEl) titleEl.textContent = item.title;
  if (captionEl) captionEl.textContent = item.caption;

  lightbox.classList.add('active');
  document.body.classList.add('modal-open');
}

function changeLightboxImage(direction) {
  const total = galleryItems.length;
  state.activeLightboxIndex = (state.activeLightboxIndex + direction + total) % total;
  const item = galleryItems[state.activeLightboxIndex];

  const imgEl = document.getElementById('lightbox-main-img');
  const titleEl = document.getElementById('lightbox-title');
  const captionEl = document.getElementById('lightbox-caption');

  if (imgEl && item) {
    imgEl.src = item.full;
    if (titleEl) titleEl.textContent = item.title;
    if (captionEl) captionEl.textContent = item.caption;
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
  document.body.classList.remove('modal-open');
}

// ==========================================================================
// 8. Navigation & Mobile Drawer
// ==========================================================================

function initNavigation() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('mobile-open');
      navMenu.classList.toggle('mobile-open');
      toggleBtn.setAttribute('aria-expanded', !isOpen);
      toggleBtn.textContent = isOpen ? '☰' : '✕';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.textContent = '☰';
      });
    });
  }
}
