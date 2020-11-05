import NextHead from 'next/head'

export default function Head ({ children }) {
  return (
    <NextHead>
      <link rel='icon' href='/favicon.ico' />
      <meta name='theme-color' content='white' />
      <link
        href='https://fonts.googleapis.com/css?family=Press+Start+2P'
        rel='preload stylesheet'
        as='style'
      />
      {children}
      <meta name='author' content='Shawn Freyssonnet-Inder <shawninder@gmail.com>' />
      <meta name='twitter:creator' content='@shawn_inder' />
    </NextHead>
  )
}
