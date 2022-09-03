import {AppProps} from 'next/app'
import '../styles/styles.scss'

function ProfileApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />
}

export default ProfileApp
