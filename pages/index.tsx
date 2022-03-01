import { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { LogoTwitter } from 'react-ionicons';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.scss'
import { useUser } from '@auth0/nextjs-auth0';

export default function Home() {
  const [ isMobile, setIsMobile ] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 600);
  }, [])

  const { user, error, isLoading } = useUser();

  return (
    <div className={styles.container}>
      <Head>
        <title>chill subs</title>

        <meta name="name" content="chill subs" />
        <meta name="description" content="Find the right home for your writing without losing your shit" />
        <meta name="image" content="/cover.png" />

        <meta property="og:url" content="https://chillsubs.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="chill subs" />
        <meta property="og:description" content="Find the right home for your writing without losing your shit" />
        <meta property="og:image" content="/cover.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="chill subs" />
        <meta name="twitter:description" content="Find the right home for your writing without losing your shit" />
        <meta name="twitter:image" content="/cover.png" />

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
          <Link href="/about">
            <div className={styles.link}>About</div>
          </Link>
          <Link href="/roadmap">
            <div className={styles.link}>Roadmap</div>
          </Link>
          <a href="https://www.buymeacoffee.com/karinakupp" target="_blank" rel="noreferrer">
            <div className={styles.link}>Support the project</div>
          </a>
          <Link href="/api/auth/login">
            <div className={styles.link}>Login</div>
          </Link>
            <div>{user && user.name}</div>
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
