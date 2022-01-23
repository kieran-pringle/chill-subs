import { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { LogoTwitter } from 'react-ionicons';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.scss'

export default function Home() {
  const [ isMobile, setIsMobile ] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 600);
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>chill subs</title>
        <meta name="description" content="Find the right home for your writing without losing your shit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.nav}>
        <Link href="/">
          <div className={styles.logo}>
            chill subs
          </div>
        </Link>
        <div className={styles.links}>
          <Link href="https://twitter.com/chillsubs">
            <LogoTwitter color="#316760" width="24px" height="24px" />
          </Link>
          {!isMobile && (
            <Link href="/about">
              <div className={styles.link}>About</div>
            </Link>
          )}
          <Link href="https://www.buymeacoffee.com/karinakupp">
            <div className={styles.link}>{!isMobile ? 'Support the project' : 'Support'}</div>
          </Link>
        </div>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Find the right home for your writing
        </h1>

        <p className={styles.description}>
          (without wasting too much energy, losing your shit and hating yourself for being unproductive)
        </p>

        <div className={styles.buttons}>
          <Link href="/browse">
            <button className={styles.searchBtn}>
              <Image src="/search.svg" alt="Search icon" width={24} height={24} />
              Browse magazines
            </button>
          </Link>
          <Link href="/about">
            <button className={styles.aboutBtn}>About the project</button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
