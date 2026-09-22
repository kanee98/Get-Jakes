/**
 * Cookie Preferences Toast Banner Component
 */
export function setupCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  
  const consent = localStorage.getItem('gj_cookie_consent') || localStorage.getItem('vt_cookie_consent');

  if (!consent) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 1800);
  }

  document.getElementById('acceptCookiesBtn')?.addEventListener('click', () => {
    localStorage.setItem('gj_cookie_consent', 'all');
    banner.classList.remove('show');
  });

  document.getElementById('essentialCookiesBtn')?.addEventListener('click', () => {
    localStorage.setItem('gj_cookie_consent', 'essential');
    banner.classList.remove('show');
  });

  document.getElementById('reopenCookiesBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    banner.classList.add('show');
  });
}
