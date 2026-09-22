/**
 * Footer Component Controller
 */
export function setupFooterComponent() {
  const footerOrdersLink = document.getElementById('footerOrdersLink');
  const bankInfoFooterLink = document.getElementById('bankInfoFooterLink');

  footerOrdersLink?.addEventListener('click', (e) => {
    e.preventDefault();
    const ordersModal = document.getElementById('ordersModal');
    ordersModal?.classList.add('open');
  });

  bankInfoFooterLink?.addEventListener('click', (e) => {
    e.preventDefault();
    const customQuoteSection = document.getElementById('customQuote');
    if (customQuoteSection) {
      customQuoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
