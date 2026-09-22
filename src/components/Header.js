/**
 * Header & Navigation Component
 */
export function setupHeaderComponent() {
  const headerLogoBtn = document.getElementById('headerLogoBtn');
  const navMyOrders = document.getElementById('navMyOrders');

  // Smooth scroll home when logo is clicked (no loader replay)
  headerLogoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector('.nav-link[href="#hero"]')?.classList.add('active');
  });

  // Nav link click smooth scroll & active state tracking
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // If clicking "My Orders", open the orders modal
      if (href === '#myOrders' || link.id === 'navMyOrders') {
        e.preventDefault();
        const ordersModal = document.getElementById('ordersModal');
        ordersModal?.classList.add('open');
        return;
      }

      if (href?.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
}
