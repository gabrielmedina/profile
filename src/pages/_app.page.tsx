import { AppProps } from 'next/app'
import '../styles/styles.scss'

const ProfileApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default ProfileApp
