import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Native anchors keep route changes on the document, without the client router.
      '@next/next/no-html-link-for-pages': 'off',
      // Images are already sized WebP, or a remote avatar with an explicit size.
      // next/image would add its client runtime to every page that renders one.
      '@next/next/no-img-element': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'public/**',
    'content/**',
  ]),
])

export default eslintConfig
