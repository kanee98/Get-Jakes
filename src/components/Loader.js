/**
 * Animated Brand Loader Overlay Component
 */
export function setupAppLoader() {
  const loader = document.getElementById('appLoader');
  const progressBar = document.getElementById('loaderProgressBar');
  const percentText = document.getElementById('loaderPercent');
  const statusText = document.getElementById('loaderStatusText');

  if (!loader) return;

  const statusSteps = [
    { p: 15, text: "Opening Get Jakes studio..." },
    { p: 40, text: "Sculpting dummy cake tiers..." },
    { p: 70, text: "Polishing waterproof finish..." },
    { p: 90, text: "Prepping props & toppers..." },
    { p: 100, text: "Welcome to Get Jakes!" }
  ];

  function runLoader() {
    loader.classList.remove('hide');
    let currentPercent = 0;
    if (progressBar) progressBar.style.width = '0%';
    if (percentText) percentText.textContent = '0%';

    const interval = setInterval(() => {
      currentPercent += 2;
      if (currentPercent > 100) currentPercent = 100;

      if (progressBar) progressBar.style.width = `${currentPercent}%`;
      if (percentText) percentText.textContent = `${currentPercent}%`;

      const matchedStep = statusSteps.find(s => currentPercent <= s.p);
      if (matchedStep && statusText) {
        statusText.textContent = matchedStep.text;
      }

      if (currentPercent >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hide');
        }, 400);
      }
    }, 28);
  }

  runLoader();
}
