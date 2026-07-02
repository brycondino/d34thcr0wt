const PORTFOLIO_THEME_KEY = 'portfolioTheme';

function getSavedPortfolioTheme() {
  try {
    return localStorage.getItem(PORTFOLIO_THEME_KEY) || 'dark';
  } catch (error) {
    return 'dark';
  }
}

function savePortfolioTheme(mode) {
  try {
    localStorage.setItem(PORTFOLIO_THEME_KEY, mode === 'bright' ? 'bright' : 'dark');
  } catch (error) {}
}

function applySavedPortfolioTheme() {
  const mode = getSavedPortfolioTheme();
  document.body.classList.toggle('bright-mode', mode === 'bright');
  return mode;
}

function setPersistentPortfolioTheme(mode) {
  const nextMode = mode === 'bright' ? 'bright' : 'dark';
  savePortfolioTheme(nextMode);
  document.body.classList.toggle('bright-mode', nextMode === 'bright');
  return nextMode;
}

window.PortfolioTheme = {
  key: PORTFOLIO_THEME_KEY,
  get: getSavedPortfolioTheme,
  save: savePortfolioTheme,
  apply: applySavedPortfolioTheme,
  set: setPersistentPortfolioTheme
};
