// Inline <script> JSON. Escapes "<" so a string cannot close the tag.
export function jsonForScript(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
