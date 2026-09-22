'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Calculator, Send } from 'lucide-react';

export default function CustomQuote() {
  const [tiers, setTiers] = useState('3');
  const [finish, setFinish] = useState('smooth');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const baseTierPrices = { '1': 95, '2': 175, '3': 245, '4': 380, '5': 550 };
  const finishMultipliers = { 'smooth': 1.0, 'textured': 1.15, 'gold': 1.30, 'naked': 1.05 };

  const base = baseTierPrices[tiers] || 245;
  const mult = finishMultipliers[finish] || 1.0;
  const estimatedPrice = Math.round(base * mult);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('/api/custom-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactInfo: contact,
          tiersCount: parseInt(tiers, 10),
          finishTexture: finish,
          estimatedPrice
        })
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      alert(`Thank you! Custom quote request for ${contact} received. Our master artisan will reach out within 2 hours.`);
      setContact('');
    } catch (err) {
      alert('Failed to submit quote request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="customQuote" className="section quote-section">
      <div className="container quote-container">
        <div className="quote-card">
          <div className="quote-header">
            <span className="badge badge-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Calculator style={{ width: 14, height: 14 }} /> Instant Price Estimator
            </span>
            <h2 className="quote-title">Configure Custom Bespoke Cake Prop</h2>
            <p className="quote-subtitle">
              Select tier count, finish texture, and dimensions to calculate an instant studio estimate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="quote-form">
            <div className="quote-grid">
              <div>
                <label className="form-label">Number of Tiers</label>
                <select className="form-select" value={tiers} onChange={(e) => setTiers(e.target.value)}>
                  <option value="1">1 Tier Mini Dummy (6" - 8")</option>
                  <option value="2">2 Tiers Studio Cake (6", 8")</option>
                  <option value="3">3 Tiers Standard Wedding (6", 8", 10")</option>
                  <option value="4">4 Tiers Ballroom Showcase (6", 8", 10", 12")</option>
                  <option value="5">5 Tiers Commercial Grand Display (6"-14")</option>
                </select>
              </div>

              <div>
                <label className="form-label">Fondant Coating Finish</label>
                <select className="form-select" value={finish} onChange={(e) => setFinish(e.target.value)}>
                  <option value="smooth">Signature Smooth Fondant (White/Ivory)</option>
                  <option value="textured">Organic Stone & Plaster Texture</option>
                  <option value="gold">Authentic 24K Metallic Leaf Gilding</option>
                  <option value="naked">Semi-Naked Rustic Bakery Style</option>
                </select>
              </div>
            </div>

            <div style={{ margin: '20px 0' }}>
              <label className="form-label">Email or Contact Phone *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. planner@luxuryevents.com or +1 (555) 019-2831"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

            <div className="quote-price-box">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Studio Price:</span>
                <div className="quote-price">${estimatedPrice}.00</div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary">
                <Send style={{ width: 16, height: 16 }} /> {submitting ? 'Submitting...' : 'Request Studio Consultation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
