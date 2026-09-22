/**
 * Header & Navigation Component
 */
export function setupHeaderComponent() {
  const headerLogoBtn = document.getElementById('headerLogoBtn');
  const accountPortalBtn = document.getElementById('accountPortalBtn');

  // Smooth scroll home when logo is clicked
  headerLogoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector('.nav-link[href="#hero"]')?.classList.add('active');
  });

  // Account & Orders button click handler
  if (accountPortalBtn) {
    accountPortalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // If holding Alt/Option key or clicking secondary, open Admin Portal
      if (e.altKey || e.shiftKey) {
        const adminModal = document.getElementById('adminDashboardModal');
        adminModal?.classList.add('open');
        return;
      }

      const ordersModal = document.getElementById('ordersModal');
      ordersModal?.classList.add('open');
    });
  }

  // Nav link click smooth scroll & active state tracking
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
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
