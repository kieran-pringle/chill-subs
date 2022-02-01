import { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { LogoTwitter } from 'react-ionicons';
import Footer from '../components/Footer';
import styles from '../styles/About.module.scss'

export default function About() {
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
          About the project
        </h1>

        <p className={styles.description}>
          There are too many magazines out there, and that's pretty damn overwhelming. You look at all those rules, response times, read thousands of issues to find the right fit for yourself, and you still have no idea how to choose which piece goes where (and when), so you end up not submitting anywhere at all 🤡 
        </p>
        
        <p className={styles.description}>
          Which is stupid. You obviously want to be famous and accomplished and sexy, that’s why you have to submit at least something.
        </p>

        <p className={styles.description}>
          <strong>chill subs</strong> is here to help with that. 
          We’ll give you some very nice search tools and cool details about each magazine (basic stuff, strength/weaknesses, examples of what they publish, contributors info).
        </p>

        <p className={styles.description}>
          We’re more personable than Duotrope and more functional than a typical <br /> “top 100 magazines” article <br />(both are great, but still, we’re an awesome mix of both).
        </p>

        <p className={styles.description}>
          Ideally, we want this to become your warm and cozy writers club. If this goes well, we’ll add some communication platform, a community library with all our publications, merch store, stuff like that:) We can add a possibility to create an account and save your favorite magazines, how about that?
        </p>

        <p className={styles.description}>
          Feel free to suggest magazines, ideas and help! (seriously, I have quite a history of abandoning projects because I can’t interact with the outside world for too long, that’s why someone more extraverted could definitely help lol)
        </p>

        <div className={styles.contact}>
          Hit us up on <Link href="https://twitter.com/chillsubs">Twitter</Link> (and tag us if we managed to help you somehow🙂)
        </div>

        <div className={styles.creator}>
          <h2>Creator</h2>
          <div className={styles.creatorInfo}>
            <Image src="/creator.jpeg" alt="Creator" layout="fixed" width={240} height={300} />
            <div className={styles.creatorText}>
              <p>
                <strong>Karina Kupp</strong> is a writer, musician, and software developer. Her work is forthcoming in BULLSHIT LIT and HOLYFLEA!. She can often be found creating yet another Spotify playlist, taking a spontaneous trip to the other side of the world, or thinking about her next startup idea. She currently lives in Poland with her husband and a very adorable cat.
              </p>

              <p>
                Enjoy her very irregular tweets here: <Link href="https://twitter.com/karinakupp">@karinakupp</Link>
              </p>

              <p>
                Or find her on Instagram, where she posts poems sometimes: <Link href="https://instagram.com/mutedpoems">@mutedpoems</Link>
              </p>
            </div>
          </div>
        </div>

        {/* <div className={styles.buttons}>
          <Link href="/browse">
            <button className={styles.searchBtn}>
              <Image src="/search.svg" alt="Search icon" width={24} height={24} />
              Browse magazines
            </button>
          </Link>
          <button className={styles.aboutBtn}>About the project</button>
        </div> */}
      </main>

      <Footer />
    </div>
  )
}
