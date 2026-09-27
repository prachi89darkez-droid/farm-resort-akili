/**
 * ==========================================================================
 * LuxeStay Atithi Niwas - Administrative Dashboard Logic
 * Upgraded: Booking Status Management (Pending, Confirmed, Cancelled)
 * ==========================================================================
 */

import { 
  getCottages, 
  getBookings, 
  updateBookingStatus, 
  getMenuData, 
  saveMenuData, 
  resetAllDataToDefault 
} from './store.js';

let currentEditingDay = 'today'; // 'today' | 'tomorrow'

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderBookingsTable();
  renderCottagesOverview();
  initMenuEditor();
  initResetButton();
});

// Helper for Indian Rupee Currency Formatting
function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Show alert banner
function showAlert(message, type = 'success') {
  const alertEl = document.getElementById('admin-alert');
  if (!alertEl) return;

  alertEl.className = `alert-banner alert-${type}`;
  alertEl.textContent = message;
  alertEl.style.display = 'flex';
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  setTimeout(() => {
    alertEl.style.display = 'none';
  }, 4500);
}

// ==========================================================================
// 1. Tab Navigation
// ==========================================================================

function initTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
      });

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'block';
      }

      // Refresh data when switching tabs
      if (targetId === 'tab-bookings') renderBookingsTable();
      if (targetId === 'tab-cottages') renderCottagesOverview();
      if (targetId === 'tab-menu') loadMenuIntoForm(currentEditingDay);
    });
  });
}

// ==========================================================================
// 2. Bookings Manager & Status Editor (Pending, Confirmed, Cancelled)
// ==========================================================================

function renderBookingsTable() {
  const tbody = document.getElementById('admin-bookings-table-body');
  const countBadge = document.getElementById('admin-booking-count');
  if (!tbody) return;

  const bookings = getBookings();
  if (countBadge) countBadge.textContent = bookings.length;

  if (bookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: var(--space-2xl); color: var(--color-text-muted);">
          No booking requests registered in demo storage.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    const d1 = new Date(b.checkIn);
    const d2 = new Date(b.checkOut);
    const nights = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 1;

    let badgeClass = 'status-available';
    if (b.status === 'Pending') badgeClass = 'badge-gold';
    if (b.status === 'Cancelled') badgeClass = 'badge-light';

    return `
      <tr>
        <td>
          <strong style="color: var(--color-gold-dark);">${b.id}</strong><br>
          <span style="font-size: 0.72rem; color: var(--color-text-muted);">${b.createdAt || 'Recent'}</span>
        </td>

        <td>
          <strong>${b.guestName}</strong><br>
          <span style="font-size: 0.8rem; color: var(--color-text-secondary);">📞 ${b.phone}</span>
        </td>

        <td>
          <strong>${b.cottageName}</strong><br>
          <span style="font-size: 0.78rem; color: var(--color-text-muted);">${b.guestsCount} Guest(s) &bull; ${b.meals}</span>
        </td>

        <td><strong>${b.checkIn}</strong></td>
        <td><strong>${b.checkOut}</strong></td>

        <td>${nights} Night${nights > 1 ? 's' : ''}</td>

        <td>
          <span class="badge ${badgeClass}" id="badge-status-${b.id}">
            ${b.status}
          </span>
        </td>

        <td style="text-align: right;">
          <select class="booking-status-select" data-booking-id="${b.id}" style="padding: 6px 10px; border-radius: var(--radius-xs); border: 1px solid var(--color-border); font-size: 0.82rem; font-weight: 600; background: #FFFFFF; cursor: pointer;">
            <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled (Free Dates)</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');

  // Status Change Event Handler
  tbody.querySelectorAll('.booking-status-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const bookingId = e.currentTarget.getAttribute('data-booking-id');
      const newStatus = e.currentTarget.value;

      const updated = updateBookingStatus(bookingId, newStatus);
      renderBookingsTable();

      if (newStatus === 'Cancelled') {
        showAlert(`Booking ${bookingId} has been CANCELLED. The dates (${updated.checkIn} to ${updated.checkOut}) for ${updated.cottageName} are now immediately available on the website!`, 'success');
      } else {
        showAlert(`Booking ${bookingId} status updated to "${newStatus}". Dates (${updated.checkIn} to ${updated.checkOut}) are marked as reserved.`, 'success');
      }
    });
  });
}

// ==========================================================================
// 3. The 5 Cottages Overview & Current Reservation Schedules
// ==========================================================================

function renderCottagesOverview() {
  const tbody = document.getElementById('admin-cottages-table-body');
  if (!tbody) return;

  const cottages = getCottages();
  const bookings = getBookings();

  tbody.innerHTML = cottages.map(c => {
    // Find active bookings for this cottage
    const activeBookings = bookings.filter(b => b.cottageId === c.id && b.status !== 'Cancelled');

    return `
      <tr>
        <td><strong>Unit ${c.number}</strong></td>
        <td>
          <strong>${c.name}</strong><br>
          <span style="font-size: 0.78rem; color: var(--color-text-muted);">${c.tagline}</span>
        </td>
        <td>Up to ${c.maxGuests} Guests</td>
        <td><strong>${formatINR(c.pricePerNight)}</strong></td>
        <td>
          ${activeBookings.length === 0 
            ? `<span style="color: #2E7D32; font-size: 0.82rem; font-weight: 600;">✓ No active bookings (Fully open)</span>`
            : activeBookings.map(b => `
                <div style="font-size: 0.8rem; margin-bottom: 4px; padding: 4px 8px; background: #F8F9FA; border: 1px solid var(--color-border-subtle); border-radius: 4px;">
                  📅 <strong>${b.checkIn} → ${b.checkOut}</strong> &bull; ${b.guestName} (${b.status})
                </div>
              `).join('')
          }
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================================================
// 4. Dining Menu Editor (Today & Tomorrow)
// ==========================================================================

function initMenuEditor() {
  const btnToday = document.getElementById('btn-edit-today');
  const btnTomorrow = document.getElementById('btn-edit-tomorrow');
  const form = document.getElementById('menu-editor-form');
  const saveBtn = document.getElementById('btn-save-menu');

  if (btnToday && btnTomorrow) {
    btnToday.addEventListener('click', () => {
      currentEditingDay = 'today';
      btnToday.classList.add('active');
      btnTomorrow.classList.remove('active');
      document.getElementById('menu-editor-title').textContent = "Dining Menu Editor • Today's Menu";
      loadMenuIntoForm('today');
    });

    btnTomorrow.addEventListener('click', () => {
      currentEditingDay = 'tomorrow';
      btnTomorrow.classList.add('active');
      btnToday.classList.remove('active');
      document.getElementById('menu-editor-title').textContent = "Dining Menu Editor • Tomorrow's Menu";
      loadMenuIntoForm('tomorrow');
    });
  }

  loadMenuIntoForm('today');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveMenuFromForm();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveMenuFromForm();
    });
  }
}

function loadMenuIntoForm(dayKey) {
  const menuData = getMenuData();
  const day = menuData[dayKey];
  if (!day) return;

  const breakfastEl = document.getElementById('edit-breakfast');
  const lunchEl = document.getElementById('edit-lunch');
  const snacksEl = document.getElementById('edit-snacks');
  const dinnerEl = document.getElementById('edit-dinner');

  if (breakfastEl) breakfastEl.value = (day.breakfast || []).join('\n');
  if (lunchEl) lunchEl.value = (day.lunch || []).join('\n');
  if (snacksEl) snacksEl.value = (day.snacks || []).join('\n');
  if (dinnerEl) dinnerEl.value = (day.dinner || []).join('\n');
}

function saveMenuFromForm() {
  const menuData = getMenuData();
  const day = menuData[currentEditingDay];
  if (!day) return;

  const parseLines = (id) => {
    const el = document.getElementById(id);
    if (!el) return [];
    return el.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  day.breakfast = parseLines('edit-breakfast');
  day.lunch = parseLines('edit-lunch');
  day.snacks = parseLines('edit-snacks');
  day.dinner = parseLines('edit-dinner');

  saveMenuData(menuData);
  showAlert(`Successfully updated ${currentEditingDay === 'today' ? "Today's" : "Tomorrow's"} dining menu! Live on the public website.`);
}

// ==========================================================================
// 5. Reset Demo Data
// ==========================================================================

function initResetButton() {
  const resetBtn = document.getElementById('btn-reset-demo');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all 5 cottages, seed bookings, and menus to default demo data?')) {
      resetAllDataToDefault();
      renderBookingsTable();
      renderCottagesOverview();
      loadMenuIntoForm(currentEditingDay);
      showAlert('All demonstration data has been reset to defaults.');
    }
  });
}
