import { site } from './site'

export function absoluteUrl(path = '/') {
  if (path === '/' || path === '') return site.url

  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}
