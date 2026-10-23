export function trackAttrs(event: string, properties?: Record<string, string>) {
  return {
    'data-track': event,
    ...(properties ? { 'data-track-props': JSON.stringify(properties) } : {}),
  }
}
