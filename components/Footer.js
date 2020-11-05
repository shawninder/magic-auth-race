import Image from 'next/image'
import styles from '../styles/Footer.module.css'

import { toAbsoluteUrl } from '../utils'

import poweredBy from '../static/powered-by.json'

export default function Footer () {
  return (
    <section className={styles.footer}>
      <h4>Powered by{' '}</h4>
      {poweredBy.map(({ href, img, alt, width, height }, idx, all) => {
        return (
          <a
            key={href}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              src={toAbsoluteUrl(img)}
              alt={alt}
              width={width}
              height={height}
            />
          </a>
        )
      })}
    </section>
  )
}
