/**
 * ==========================================================================
 * FARM RESORT. AKILI - Payment Calculation Module
 * ==========================================================================
 * 
 * This module is structured for future integration with a real payment
 * gateway (Razorpay, UPI, etc.). Currently it performs calculations only
 * and marks payments as "Demo Integration" — NO real money is collected.
 * 
 * To connect a real gateway later, replace the `processPayment` function
 * with a call to the gateway's SDK. The calculation logic (total, advance,
 * remaining) can stay as-is.
 */

// Advance percentage: 30% of total (minimum ₹500)
const ADVANCE_PERCENTAGE = 0.30;
const MINIMUM_ADVANCE = 500;

/**
 * Calculates the full payment breakdown for a booking.
 *
 * @param {number} ratePerPeriod - rate per night (accommodation) or per day (hall)
 * @param {number} numberOfPeriods - number of nights (accommodation) or days (hall)
 * @returns {{ totalAmount: number, advanceAmount: number, remainingAmount: number }}
 */
export function calculatePayment(ratePerPeriod, numberOfPeriods) {
  const totalAmount = ratePerPeriod * numberOfPeriods;
  const calculatedAdvance = Math.round(totalAmount * ADVANCE_PERCENTAGE);
  const advanceAmount = Math.max(calculatedAdvance, MINIMUM_ADVANCE);
  const remainingAmount = totalAmount - advanceAmount;

  return {
    totalAmount,
    advanceAmount,
    remainingAmount
  };
}

/**
 * Generates a demo transaction reference ID.
 * In production, this would come from the payment gateway response.
 */
export function generateDemoReferenceId() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DEMO-UPI-${timestamp}${random}`;
}

/**
 * Processes a payment in demo mode.
 * 
 * In production, this function would:
 * 1. Call the payment gateway SDK (e.g., Razorpay checkout)
 * 2. Verify the payment signature server-side
 * 3. Return the gateway's transaction reference ID
 *
 * Currently it simulates a successful advance payment and returns
 * a demo reference. The payment status clearly indicates "Demo Integration".
 *
 * @param {number} advanceAmount - the advance amount to "charge"
 * @param {string} method - selected payment method
 * @returns {{ success: boolean, status: string, method: string, referenceId: string, isDemo: boolean }}
 */
export function processPayment(advanceAmount, method) {
  const referenceId = generateDemoReferenceId();

  return {
    success: true,
    status: 'Advance Paid (Demo Integration)',
    method: method || 'UPI (Demo Integration)',
    referenceId,
    isDemo: true,
    advanceAmount
  };
}

/**
 * Payment method options available in the form.
 * Ready for real gateway integration — just add real methods here.
 */
export const paymentMethods = [
  { value: 'UPI (Demo Integration)', label: 'UPI (Demo Integration)' },
  { value: 'Card (Demo Integration)', label: 'Credit/Debit Card (Demo Integration)' },
  { value: 'Net Banking (Demo Integration)', label: 'Net Banking (Demo Integration)' },
  { value: 'Pay at Front Desk', label: 'Pay Advance at Front Desk (No Online Payment)' }
];
