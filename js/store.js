/**
 * ==========================================================================
 * LuxeStay Atithi Niwas - Data Store & State Service
 * Upgraded: Standard Date-Based Availability Engine
 * ==========================================================================
 * 
 * ARCHITECTURE NOTE:
 * Cottages are NOT locked as permanently "Booked" for all time.
 * Instead, live availability is calculated dynamically per requested date range
 * by evaluating all active (Confirmed or Pending) bookings against the standard
 * date overlap formula:
 * 
 *   requestedCheckIn < existingCheckOut AND requestedCheckOut > existingCheckIn
 * 
 * Cancelled bookings do NOT block availability.
 * When switching to a real backend (Node.js, Supabase, PostgreSQL), only the
 * functions in this file will need to be replaced with async API calls.
 */

import { initialCottages, initialMenuData, initialBookingRequests } from './data.js';

const STORAGE_KEYS = {
  COTTAGES: 'luxestay_cottages_date_v3',
  MENU: 'luxestay_menu_date_v3',
  BOOKINGS: 'luxestay_bookings_date_v3',
  SAVED_COTTAGES: 'luxestay_saved_cottages_date_v3'
};

// ==========================================================================
// 1. Date Overlap Mathematics
// ==========================================================================

/**
 * Standard date range overlap algorithm:
 * Overlap exists IF AND ONLY IF:
 * (startA < endB) AND (endA > startB)
 */
export function isDateRangeOverlapping(startA, endA, startB, endB) {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  return (sA < eB) && (eA > sB);
}

// ==========================================================================
// 2. Cottages Store
// ==========================================================================

export function getCottages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COTTAGES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read cottages from localStorage', err);
  }
  saveCottages(initialCottages);
  return [...initialCottages];
}

export function saveCottages(cottages) {
  try {
    localStorage.setItem(STORAGE_KEYS.COTTAGES, JSON.stringify(cottages));
  } catch (err) {
    console.error('Failed to save cottages to localStorage', err);
  }
}

// ==========================================================================
// 3. Bookings Store & Dynamic Date-Based Availability
// ==========================================================================

export function getBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read bookings from localStorage', err);
  }
  saveBookings(initialBookingRequests);
  return [...initialBookingRequests];
}

export function saveBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (err) {
    console.error('Failed to save bookings to localStorage', err);
  }
}

/**
 * Checks if a specific cottage is available for a requested checkIn -> checkOut date range.
 * Considers bookings with status === 'Confirmed' or status === 'Pending'.
 * Bookings with status === 'Cancelled' are ignored.
 */
export function isCottageAvailableForDates(cottageId, requestedCheckIn, requestedCheckOut, excludeBookingId = null) {
  const bookings = getBookings();

  // Find any active overlapping bookings for this cottage
  const conflictingBookings = bookings.filter(b => {
    if (b.cottageId !== cottageId) return false;
    if (b.status === 'Cancelled') return false; // Cancelled does NOT block dates!
    if (excludeBookingId && b.id === excludeBookingId) return false;

    return isDateRangeOverlapping(requestedCheckIn, requestedCheckOut, b.checkIn, b.checkOut);
  });

  return {
    available: conflictingBookings.length === 0,
    conflictingBookings
  };
}

/**
 * Calculates availability for ALL 5 cottages for a specified date range.
 */
export function getAvailabilityForDateRange(checkIn, checkOut) {
  const cottages = getCottages();

  const cottagesWithStatus = cottages.map(cottage => {
    const check = isCottageAvailableForDates(cottage.id, checkIn, checkOut);
    return {
      ...cottage,
      isAvailableForDates: check.available,
      conflicts: check.conflictingBookings
    };
  });

  const availableCount = cottagesWithStatus.filter(c => c.isAvailableForDates).length;
  const bookedCount = cottagesWithStatus.length - availableCount;

  return {
    checkIn,
    checkOut,
    total: cottagesWithStatus.length, // Exactly 5
    availableCount,
    bookedCount,
    cottages: cottagesWithStatus
  };
}

/**
 * Creates a new booking request after validating date availability.
 */
export function createBookingRequest(formData) {
  const { cottageId, checkIn, checkOut } = formData;

  // 1. Rigorous Date-Overlap Availability Check
  const check = isCottageAvailableForDates(cottageId, checkIn, checkOut);
  if (!check.available) {
    const firstConflict = check.conflictingBookings[0];
    return {
      success: false,
      error: `Conflict: This cottage is already reserved from ${firstConflict.checkIn} to ${firstConflict.checkOut} (${firstConflict.status}).`
    };
  }

  // 2. Generate Booking
  const bookings = getBookings();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

  const newBooking = {
    id: `BK-2026-${randomSuffix}`,
    createdAt: dateStr,
    guestName: formData.guestName.trim(),
    phone: formData.phone.trim(),
    email: formData.email ? formData.email.trim() : 'N/A',
    cottageId: formData.cottageId,
    cottageName: formData.cottageName,
    checkIn: formData.checkIn,
    checkOut: formData.checkOut,
    guestsCount: parseInt(formData.guestsCount, 10) || 1,
    cottageCount: parseInt(formData.cottageCount, 10) || 1,
    meals: formData.meals || 'No Meals',
    specialRequest: formData.specialRequest ? formData.specialRequest.trim() : 'None',
    status: 'Pending' // "Pending" | "Confirmed" | "Cancelled"
  };

  bookings.unshift(newBooking);
  saveBookings(bookings);

  return {
    success: true,
    booking: newBooking
  };
}

/**
 * Updates a booking's status between "Pending", "Confirmed", and "Cancelled".
 * If marked as "Cancelled", the cottage dates are immediately freed up!
 */
export function updateBookingStatus(bookingId, newStatus) {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);

  if (index !== -1) {
    bookings[index].status = newStatus;
    saveBookings(bookings);
    return bookings[index];
  }
  return null;
}

// ==========================================================================
// 4. Dining Menu Store
// ==========================================================================

export function getMenuData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read menu from localStorage', err);
  }
  saveMenuData(initialMenuData);
  return { ...initialMenuData };
}

export function saveMenuData(menuData) {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuData));
  } catch (err) {
    console.error('Failed to save menu data to localStorage', err);
  }
}

// ==========================================================================
// 5. Favorites Store
// ==========================================================================

export function getSavedCottages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_COTTAGES);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function toggleSaveCottage(cottageId) {
  let saved = getSavedCottages();
  if (saved.includes(cottageId)) {
    saved = saved.filter(id => id !== cottageId);
  } else {
    saved.push(cottageId);
  }
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_COTTAGES, JSON.stringify(saved));
  } catch (err) {
    console.warn(err);
  }
  return saved;
}

// ==========================================================================
// 6. Reset to Demonstration Defaults
// ==========================================================================

export function resetAllDataToDefault() {
  saveCottages(initialCottages);
  saveMenuData(initialMenuData);
  saveBookings(initialBookingRequests);
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_COTTAGES);
  } catch (err) {}
}
