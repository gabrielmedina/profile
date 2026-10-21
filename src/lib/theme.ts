export const THEME_STORAGE_KEY = 'theme'
export const THEME_DARK = 'tokens-dark'
export const THEME_LIGHT = 'tokens-light'

export type ThemeName = typeof THEME_DARK | typeof THEME_LIGHT

// Runs before paint so the saved theme wins over the server default without a flash.
export const themeBootScript = `(function(){try{var key=${JSON.stringify(THEME_STORAGE_KEY)};var dark=${JSON.stringify(THEME_DARK)};var light=${JSON.stringify(THEME_LIGHT)};var stored=localStorage.getItem(key);var theme=stored===dark||stored===light?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?dark:light);var root=document.documentElement;root.classList.remove(dark,light);root.classList.add(theme);}catch(e){}})();`
