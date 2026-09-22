/**
 * Header & Navigation Component
 */
import { getCurrentUser, logoutUser } from './AuthModal.js';
import { createIcons, icons } from 'lucide';

function refreshIcons() {
  createIcons({ icons });
}

export function setupHeaderComponent(onOpenAuthModal, onOpenOrdersModal, onOpenAdminModal) {
  const headerLogoBtn = document.getElementById('headerLogoBtn');
  const accountPortalBtn = document.getElementById('accountPortalBtn');
  const accountBtnLabel = document.getElementById('accountBtnLabel');

  function updateHeaderUserUI() {
    const user = getCurrentUser();
    if (user) {
      const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Account';
      if (accountBtnLabel) {
        accountBtnLabel.textContent = `${firstName} (${user.role === 'admin' ? 'Admin' : 'Account'})`;
      }
      if (accountPortalBtn) {
        accountPortalBtn.title = `Logged in as ${user.fullName} (${user.role}). Click to view or sign out.`;
      }
    } else {
      if (accountBtnLabel) {
        accountBtnLabel.textContent = 'Sign In';
      }
      if (accountPortalBtn) {
        accountPortalBtn.title = 'Client Account & Sign In';
      }
    }
    refreshIcons();
  }

  updateHeaderUserUI();
  window.addEventListener('gj_user_changed', updateHeaderUserUI);

  // Smooth scroll home when logo is clicked
  headerLogoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector('.nav-link[href="#hero"]')?.classList.add('active');
  });

  // Account Portal Button Click Handler
  if (accountPortalBtn) {
    accountPortalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const user = getCurrentUser();

      if (!user) {
        if (onOpenAuthModal) onOpenAuthModal('login');
        return;
      }

      if (user.role === 'admin') {
        if (onOpenAdminModal) onOpenAdminModal();
        return;
      }

      // Customer logged in: ask option to View Orders or Sign Out
      const action = confirm(`Signed in as ${user.fullName} (${user.email}).\n\nClick OK to View Your Orders, or CANCEL to Sign Out.`);
      if (action) {
        if (onOpenOrdersModal) onOpenOrdersModal();
      } else {
        logoutUser();
        alert('Signed out successfully.');
      }
    });
  }

  // Nav Links click handler
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#myOrders' || link.id === 'navMyOrders') {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) {
          if (onOpenOrdersModal) onOpenOrdersModal(); // Opens orders modal which shows login prompt
          return;
        }
        if (user.role === 'admin') {
          if (onOpenAdminModal) onOpenAdminModal();
          return;
        }
        if (onOpenOrdersModal) onOpenOrdersModal();
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
