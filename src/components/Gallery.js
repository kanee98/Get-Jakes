/**
 * Showcase Gallery Component
 */
import { GALLERY_ITEMS } from '../data/productsData.js';

export function renderGallery() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  container.innerHTML = GALLERY_ITEMS.map(item => `
    <div class="gallery-card">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="gallery-overlay">
        <span class="badge badge-brand" style="margin-bottom: 8px; width: fit-content;">${item.category}</span>
        <h4 class="gallery-title">${item.title}</h4>
        <p style="font-size: 0.85rem; color: #DDD;">${item.desc}</p>
      </div>
    </div>
  `).join('');
}
