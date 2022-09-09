import { AppProps } from 'next/app'
import { Theme } from 'src/components/layouts'
import '../styles/styles.scss'

const ProfileApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Theme>
      <Component {...pageProps} />
    </Theme>
  )
}

export default ProfileApp
