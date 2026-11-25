import type { ImageSize } from '@/features/posts/types'
import styles from './post-media.module.scss'

type PostMediaProps = {
  src: string
  alt: string
  size?: ImageSize
  priority?: boolean
}

export function PostMedia({ src, alt, size, priority }: PostMediaProps) {
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
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
          />
        )}
        <div className={styles.overlay} aria-hidden="true" />
      </div>
    </div>
  )
}
