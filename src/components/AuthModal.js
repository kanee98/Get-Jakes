/**
 * Authentication & Account Modal Component
 */
import { loginUserApi, registerUserApi } from '../services/api.js';
import { createIcons, icons } from 'lucide';

function refreshIcons() {
  createIcons({ icons });
}

export function getCurrentUser() {
  const saved = localStorage.getItem('gj_current_user');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return null;
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('gj_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('gj_current_user');
  }
  window.dispatchEvent(new CustomEvent('gj_user_changed', { detail: user }));
}

export function logoutUser() {
  setCurrentUser(null);
}

export function setupAuthModal(onLoginSuccess) {
  const modal = document.getElementById('authModal');
  const tabLogin = document.getElementById('authTabLogin');
  const tabRegister = document.getElementById('authTabRegister');
  const loginForm = document.getElementById('authLoginForm');
  const registerForm = document.getElementById('authRegisterForm');
  const errorBox = document.getElementById('authErrorMessage');

  const demoCustomerBtn = document.getElementById('btnDemoCustomerLogin');
  const demoAdminBtn = document.getElementById('btnDemoAdminLogin');

  function openAuthModal(targetTab = 'login') {
    hideError();
    switchTab(targetTab);
    modal?.classList.add('open');
    refreshIcons();
  }

  function closeAuthModal() {
    modal?.classList.remove('open');
  }

  modal?.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', closeAuthModal);
  });

  function showError(msg) {
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.style.display = 'block';
    }
  }

  function hideError() {
    if (errorBox) {
      errorBox.style.display = 'none';
      errorBox.textContent = '';
    }
  }

  function switchTab(tab) {
    hideError();
    if (tab === 'login') {
      tabLogin?.classList.add('active');
      tabRegister?.classList.remove('active');
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
    } else {
      tabRegister?.classList.add('active');
      tabLogin?.classList.remove('active');
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
    }
  }

  tabLogin?.addEventListener('click', () => switchTab('login'));
  tabRegister?.addEventListener('click', () => switchTab('register'));

  // Form Submissions
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    const email = document.getElementById('authLoginEmail').value;
    const password = document.getElementById('authLoginPassword').value;

    try {
      const res = await loginUserApi({ email, password });
      handleSuccessfulAuth(res.user);
    } catch (err) {
      showError(err.message || 'Invalid email or password');
    }
  });

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    const fullName = document.getElementById('authRegName').value;
    const email = document.getElementById('authRegEmail').value;
    const password = document.getElementById('authRegPassword').value;

    try {
      const res = await registerUserApi({ fullName, email, password });
      handleSuccessfulAuth(res.user);
    } catch (err) {
      showError(err.message || 'Registration failed');
    }
  });

  // Demo Shortcuts
  demoCustomerBtn?.addEventListener('click', async () => {
    document.getElementById('authLoginEmail').value = 'eleanor@chateauxevents.com';
    document.getElementById('authLoginPassword').value = 'password';
    try {
      const res = await loginUserApi({ email: 'eleanor@chateauxevents.com', password: 'password' });
      handleSuccessfulAuth(res.user);
    } catch (err) {
      showError(err.message);
    }
  });

  demoAdminBtn?.addEventListener('click', async () => {
    document.getElementById('authLoginEmail').value = 'admin@getjakes.com';
    document.getElementById('authLoginPassword').value = 'admin123';
    try {
      const res = await loginUserApi({ email: 'admin@getjakes.com', password: 'admin123' });
      handleSuccessfulAuth(res.user);
    } catch (err) {
      showError(err.message);
    }
  });

  function handleSuccessfulAuth(user) {
    setCurrentUser(user);
    closeAuthModal();

    if (onLoginSuccess) onLoginSuccess(user);

    if (user.role === 'admin') {
      // Redirect Admin directly to Admin Dashboard Portal
      const adminModal = document.getElementById('adminDashboardModal');
      adminModal?.classList.add('open');
    }
  }

  return { openAuthModal, closeAuthModal };
}
