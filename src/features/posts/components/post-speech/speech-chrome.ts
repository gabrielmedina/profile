export const RATES = [0.75, 1, 1.25, 1.5] as const

// Safari and Chrome on iPhone and iPad expose speechSynthesis, but native
// speech does not play. Leave the controls hidden on those browsers.
export const speechRevealScript = `(function(){var script=document.currentScript;var root=script&&script.previousElementSibling;if(!root)return;var ua=navigator.userAgent;var ios=/iPad|iPhone|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);var synth=window.speechSynthesis;var ok=!ios&&!!synth&&typeof synth.speak==="function"&&typeof SpeechSynthesisUtterance==="function";if(ok)root.hidden=false})();`

export function formatRate(rate: number) {
  return `${rate.toLocaleString('pt-BR')}×`
}
