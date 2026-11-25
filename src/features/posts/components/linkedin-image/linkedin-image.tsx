import type { ImageSize } from '../../types'
import styles from './linkedin-image.module.scss'

type LinkedInImageProps = {
  src: string
  alt: string
  size?: ImageSize
}

export function LinkedInImage({ src, alt, size }: LinkedInImageProps) {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm')

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.container}
        style={
          size
            ? { aspectRatio: `${size.width} / ${size.height}` }
            : undefined
        }
      >
        {isVideo ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className={styles.media}
            aria-label={alt}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            width={size?.width}
            height={size?.height}
            className={styles.media}
            loading="eager"
            decoding="async"
          />
        )}
        <div className={styles.overlay} aria-hidden="true" />
      </div>
    </div>
  )
}
