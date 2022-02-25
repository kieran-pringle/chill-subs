import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { LogoTwitter } from 'react-ionicons';
import posts from '!!json5-loader!../../data/posts.json5';
import Footer from '../../components/Footer';
import styles from '../../styles/Blog.module.scss'

export default function About() {

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
        </div>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Blog
        </h1>
        <div className={styles.cards}>
          {posts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <div className={styles.card}>
                <Image src={post.cover} className={styles.cardImage} width="120" height="120" />
                <div className={styles.cardInfo}>
                  <div className={styles.cardDate}>{post.date}</div>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
