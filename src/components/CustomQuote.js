/**
 * Custom Quote Estimator Component
 */
import confetti from 'canvas-confetti';

export function setupQuoteCalculator() {
  const form = document.getElementById('customQuoteForm');
  const tiersSelect = document.getElementById('quoteTiers');
  const finishSelect = document.getElementById('quoteFinish');
  const priceDisplay = document.getElementById('quoteEstimatePrice');

  if (!form || !tiersSelect || !finishSelect || !priceDisplay) return;

  const baseTierPrices = { '1': 95, '2': 175, '3': 245, '4': 380, '5': 550 };
  const finishMultipliers = { 'smooth': 1.0, 'textured': 1.15, 'gold': 1.30, 'naked': 1.05 };

  function updateEstimate() {
    const tierVal = tiersSelect.value;
    const finishVal = finishSelect.value;
    const base = baseTierPrices[tierVal] || 245;
    const mult = finishMultipliers[finishVal] || 1.0;
    const total = Math.round(base * mult);
    priceDisplay.textContent = `$${total}.00`;
  }

  tiersSelect.addEventListener('change', updateEstimate);
  finishSelect.addEventListener('change', updateEstimate);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const contact = document.getElementById('quoteContact').value;
    
    // Confetti effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    alert(`Thank you! Custom quote request for ${contact} received. Our master artisan will reach out within 2 hours.`);
    form.reset();
    updateEstimate();
  });
}
