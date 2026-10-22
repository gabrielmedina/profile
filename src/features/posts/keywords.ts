export function splitKeywords(keys: string) {
  return keys
    .split(',')
    .map((key) => key.trim())
    .filter((key) => key.length > 0)
}
