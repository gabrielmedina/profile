import {
  THEME_COLOR,
  THEME_DARK,
  THEME_LIGHT,
  THEME_STORAGE_KEY,
} from './theme'

// Runs before paint: saved theme, current path for CSS, [data-theme] toggles,
// and a tiny analytics queue. Nav aria-current is rendered by React.
export function documentBootScript(analyticsKey: string) {
  const key = JSON.stringify(THEME_STORAGE_KEY)
  const dark = JSON.stringify(THEME_DARK)
  const light = JSON.stringify(THEME_LIGHT)
  const colors = JSON.stringify(THEME_COLOR)
  const analytics = JSON.stringify(analyticsKey)

  return `(function(){var key=${key};var dark=${dark};var light=${light};var colors=${colors};var root=document.documentElement;function apply(theme){root.classList.remove(dark,light);root.classList.add(theme);var meta=document.querySelector('meta[name="theme-color"]');if(meta&&colors[theme])meta.setAttribute("content",colors[theme])}try{var stored=localStorage.getItem(key);apply(stored===dark||stored===light?stored:(matchMedia("(prefers-color-scheme: dark)").matches?dark:light))}catch(e){}root.setAttribute("data-path",location.pathname);var site=window.__site=window.__site||{queue:[],key:${analytics}};site.track=function(event,props){site.queue.push([event,props||{}]);if(site.flush)site.flush()};document.addEventListener("click",function(event){var node=event.target;var button=node&&node.closest?node.closest("[data-theme]"):null;if(!button)return;var next=button.getAttribute("data-theme");if(next!==dark&&next!==light)return;apply(next);try{localStorage.setItem(key,next)}catch(e){}site.track("changed-theme",{theme:next})})})();`
}
