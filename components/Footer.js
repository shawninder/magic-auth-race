import styles from '../styles/Footer.module.css'
import poweredBy from '../static/powered-by.json'

export default function Footer () {
  return (
    <section className={styles.footer}>
      Powered by{' '}
      {poweredBy.map(({ href, img, alt, styles }, idx, all) => {
        return (
          <a
            key={href}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src={img}
              alt={alt}
              style={styles}
            />
          </a>
        )
      })}
    </section>
  )
}
