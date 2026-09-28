/**
 * ==========================================================================
 * FARM RESORT. AKILI - Booking Receipt Generator
 * ==========================================================================
 * 
 * Generates a professional, printable booking receipt after a successful
 * booking + advance payment. The receipt is injected into a modal and
 * includes a Print / Save as PDF option via window.print().
 * 
 * No email/SMS is sent — this is purely an on-screen printable receipt.
 */

/**
 * Generates the receipt HTML and injects it into the receipt modal.
 *
 * @param {object} booking - the booking object from store.js
 * @param {object} unit - the cottage or hall object
 * @param {number} numberOfPeriods - nights (accommodation) or days (hall)
 */
export function generateReceipt(booking, unit, numberOfPeriods) {
  const receiptContainer = document.getElementById('receipt-content');
  if (!receiptContainer) return;

  const isHall = booking.bookingType === 'hall';
  const periodLabel = isHall ? 'Day' : 'Night';
  const rateLabel = isHall ? 'Rate Per Day' : 'Rate Per Night';
  const dateLabel = isHall ? 'Booking Date(s)' : 'Stay Duration';

  const otherGuestsHtml = (booking.otherGuests && booking.otherGuests.length > 0)
    ? booking.otherGuests.map((g, i) => `
        <tr>
          <td>Guest ${i + 1}</td>
          <td>${g.name}</td>
          <td>${g.age}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="3" style="color: var(--color-text-muted);">No additional guests</td></tr>';

  const payment = booking.payment || {};

  receiptContainer.innerHTML = `
    <div class="receipt-document" id="receipt-document">
      
      <!-- Receipt Header -->
      <div class="receipt-header">
        <div class="receipt-brand">
          <span class="receipt-brand-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 20A7 7 0 0 1 4 13C4 8.5 8 3 13 3c5.5 0 7 2.5 7 7a7 7 0 0 1-7 7l-2 3z"></path>
              <path d="M11 13a3.5 3.5 0 0 0 5-5"></path>
            </svg>
          </span>
          <div>
            <h2>FARM RESORT. AKILI</h2>
            <p>Gram Panchayat Tourism Complex, Near Main Block Office, State Highway 14</p>
            <p>Helpline: +91 98220 XXXXX &bull; Email: panchayat.stay@demo.gov.in</p>
          </div>
        </div>
        <div class="receipt-title-box">
          <h3>BOOKING RECEIPT</h3>
          <p class="receipt-ref-id">Ref: <strong>${booking.id}</strong></p>
          <p>Date of Booking: ${booking.createdAt}</p>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <!-- Primary Guest Information -->
      <div class="receipt-section">
        <h4 class="receipt-section-title">Primary Guest Information</h4>
        <table class="receipt-table">
          <tr>
            <td class="receipt-label">Full Name</td>
            <td class="receipt-value">${booking.guestName}</td>
            <td class="receipt-label">Age</td>
            <td class="receipt-value">${booking.guestAge || 'N/A'}</td>
          </tr>
          <tr>
            <td class="receipt-label">Primary Mobile</td>
            <td class="receipt-value">${booking.phone}</td>
            <td class="receipt-label">Alternate Mobile</td>
            <td class="receipt-value">${booking.altPhone || 'N/A'}</td>
          </tr>
          <tr>
            <td class="receipt-label">Permanent Address</td>
            <td class="receipt-value" colspan="3">${booking.address || 'N/A'}</td>
          </tr>
          <tr>
            <td class="receipt-label">Email</td>
            <td class="receipt-value" colspan="3">${booking.email || 'N/A'}</td>
          </tr>
        </table>
      </div>

      <!-- Other Guests -->
      <div class="receipt-section">
        <h4 class="receipt-section-title">Other Guests</h4>
        <table class="receipt-table receipt-guest-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            ${otherGuestsHtml}
          </tbody>
        </table>
      </div>

      <!-- Booking Details -->
      <div class="receipt-section">
        <h4 class="receipt-section-title">Booking Details</h4>
        <table class="receipt-table">
          <tr>
            <td class="receipt-label">Booking Type</td>
            <td class="receipt-value">${isHall ? 'Function Hall' : 'Accommodation'}</td>
            <td class="receipt-label">Facility Name</td>
            <td class="receipt-value">${booking.cottageName}</td>
          </tr>
          ${isHall ? `
            <tr>
              <td class="receipt-label">Start Date</td>
              <td class="receipt-value">${booking.checkIn}</td>
              <td class="receipt-label">End Date</td>
              <td class="receipt-value">${booking.checkOut}</td>
            </tr>
          ` : `
            <tr>
              <td class="receipt-label">Check-In</td>
              <td class="receipt-value">${booking.checkIn}</td>
              <td class="receipt-label">Check-Out</td>
              <td class="receipt-value">${booking.checkOut}</td>
            </tr>
          `}
          <tr>
            <td class="receipt-label">${dateLabel}</td>
            <td class="receipt-value">${numberOfPeriods} ${periodLabel}${numberOfPeriods > 1 ? 's' : ''}</td>
            <td class="receipt-label">Total Guests</td>
            <td class="receipt-value">${booking.guestsCount}</td>
          </tr>
          <tr>
            <td class="receipt-label">Meal Preference</td>
            <td class="receipt-value" colspan="3">${booking.meals || 'N/A'}</td>
          </tr>
          ${booking.specialRequest && booking.specialRequest !== 'None' ? `
            <tr>
              <td class="receipt-label">Special Requests</td>
              <td class="receipt-value" colspan="3">${booking.specialRequest}</td>
            </tr>
          ` : ''}
        </table>
      </div>

      <!-- Payment Summary -->
      <div class="receipt-section">
        <h4 class="receipt-section-title">Payment Summary</h4>
        <table class="receipt-table receipt-payment-table">
          <tr>
            <td class="receipt-label">${rateLabel}</td>
            <td class="receipt-value">₹${(isHall ? unit.pricePerDay : unit.pricePerNight).toLocaleString('en-IN')}</td>
            <td class="receipt-label">Number of ${periodLabel}s</td>
            <td class="receipt-value">${numberOfPeriods}</td>
          </tr>
          <tr class="receipt-total-row">
            <td class="receipt-label" colspan="2">Total Amount</td>
            <td class="receipt-value" colspan="2"><strong>₹${payment.totalAmount ? payment.totalAmount.toLocaleString('en-IN') : '0'}</strong></td>
          </tr>
          <tr>
            <td class="receipt-label" colspan="2">Advance Amount Paid</td>
            <td class="receipt-value" colspan="2"><strong>₹${payment.advanceAmount ? payment.advanceAmount.toLocaleString('en-IN') : '0'}</strong></td>
          </tr>
          <tr>
            <td class="receipt-label" colspan="2">Remaining Amount (Payable at Front Desk)</td>
            <td class="receipt-value" colspan="2"><strong>₹${payment.remainingAmount ? payment.remainingAmount.toLocaleString('en-IN') : '0'}</strong></td>
          </tr>
          <tr>
            <td class="receipt-label">Payment Method</td>
            <td class="receipt-value">${payment.method || 'N/A'}</td>
            <td class="receipt-label">Payment Status</td>
            <td class="receipt-value">${payment.status || 'Pending'}</td>
          </tr>
          <tr>
            <td class="receipt-label">Transaction / Reference ID</td>
            <td class="receipt-value" colspan="3"><strong>${payment.referenceId || 'N/A'}</strong></td>
          </tr>
        </table>
      </div>

      <!-- Booking Status -->
      <div class="receipt-section">
        <table class="receipt-table">
          <tr>
            <td class="receipt-label">Booking Status</td>
            <td class="receipt-value"><span class="status-pill status-available">${booking.status}</span></td>
          </tr>
        </table>
      </div>

      <!-- Check-in Information -->
      <div class="receipt-section receipt-checkin-info">
        <h4 class="receipt-section-title">Important Check-In Information</h4>
        <ul class="receipt-checkin-list">
          <li>Check-in time: 12:00 PM (Noon) &bull; Check-out time: 11:00 AM${isHall ? ' (Hall bookings are per-day)' : ''}.</li>
          <li>Government-issued photo ID (Aadhaar / PAN / Driving License / Passport) is <strong>mandatory</strong> at check-in.</li>
          <li>Remaining balance of <strong>₹${payment.remainingAmount ? payment.remainingAmount.toLocaleString('en-IN') : '0'}</strong> is payable at the front desk upon arrival.</li>
          <li>Advance cancellation notice of 48 hours is required for a full refund of the advance amount.</li>
          <li>This is a computer-generated receipt. No physical signature is required.</li>
        </ul>
      </div>

      <div class="receipt-footer">
        <p>&copy; 2026 FARM RESORT. AKILI &bull; Gram Panchayat Tourism Project</p>
        <p class="receipt-disclaimer">${payment.isDemo ? 'Payment processed via DEMO integration. No real money has been collected.' : ''}</p>
      </div>

    </div>
  `;
}
