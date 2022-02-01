import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { DiscussionEmbed } from 'disqus-react';
import { LogoTwitter } from 'react-ionicons';
import Footer from '../../components/Footer';
import { plannedFeatures, suggestions, futureFeatures } from '../roadmap';
import styles from '../../styles/Feature.module.scss';

export default function Feature() {
  const router = useRouter();
  const { featureId } = router.query;

  const [ currentFeature, setCurrentFeature ] = useState<any>(null);
  const [ isMobile, setIsMobile ] = useState<boolean>(false);

  useEffect(() => {
    if (window && window.innerWidth <= 600) {
      setIsMobile(true);
    }
  }, [])

  let disqusConfig: any;

  useEffect(() => {
    if (featureId) {
      const targetFeature = plannedFeatures.find(f => f.id === featureId)
        || suggestions.find(f => f.id === featureId)
        || futureFeatures.find(f => f.id === featureId)
      setCurrentFeature(targetFeature);
      disqusConfig = {
        url: window.location.href,
        identifier: featureId, // Single post id
        title: targetFeature.title // Single post title
      }
    }
  }, [featureId])

  if (!currentFeature) return null;

  const disqusShortname = 'chillsubs';
  
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
        <div className={styles.header}>
          <h1 className={styles.title}>{currentFeature.title}</h1>
          {currentFeature.quote && (
            <div className={styles.quote}>
              <div className={styles.quoteContent}>"{currentFeature.quote}"</div>
              {currentFeature.author && (
                <a href={`https://twitter.com/${currentFeature.author}`} target="_blank" rel="noreferrer">
                  <div className={styles.quoteAuthor}>@{currentFeature.author}</div>
                </a>
              )}
            </div>
          )}
          <div className={styles.description}>{currentFeature.description}</div>
        </div>
        <DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </main>

      <Footer />
    </div>
  )
}
