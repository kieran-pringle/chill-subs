import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Script from 'next/script'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { LogoTwitter } from 'react-ionicons';
import favorites from '!!json5-loader!../../data/favorites.json5';
import contributorsSource from '!!json5-loader!../../data/contributors.json5';
import Footer from '../../components/Footer';
import styles from '../../styles/Contributor.module.scss';

export default function Contributor() {
  const router = useRouter();
  const { contributorId } = router.query;

  const [ currentContributor, setCurrentContributor ] = useState<any>(null);
  const [ magazinesList, setMagazinesList ] = useState<any[]>([]);
  const [ isMobile, setIsMobile ] = useState<boolean>(false);

  useEffect(() => {
    if (window && window.innerWidth <= 600) {
      setIsMobile(true);
    }
  }, [])

  useEffect(() => {
    if (contributorId) {
      const contributorName = (contributorId as string).replace(/_/g, ' ');
      setCurrentContributor(contributorName);
      const contributorMagazines = contributorsSource
        .filter(m => {
          return m.contributors.find(c => c === contributorName);
        })
        .map(m => m.magazineId)
      const magazines = favorites.filter(m => contributorMagazines.includes(m.name.toLowerCase().replace(/\s/g, '-')));
      setMagazinesList(magazines);
    }
  }, [contributorId])

  if (!currentContributor) return null;
  
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
        <div className={styles.header}>
          <h1 className={styles.title}>{currentContributor}</h1>
        </div>

        <div className={styles.magazines}>
          <h2>Published in</h2>
          <div className={styles.cards}>
            {magazinesList.map((magazine, i) => (
              <Link href={`/magazine/${magazine.id}`} key={i}>
                <div className={styles.card}>
                  {magazine.open && (
                    <div className={styles.open}>Open</div>
                  )}
                  <Image src={magazine.cover || ''} width={120} height={120} />
                  <h3>{magazine.name}</h3>
                  <div className={styles.cardDescription}>{`"${magazine.description}"`}</div>
                  <div className={styles.cardStats}>
                    <div className={styles.cardStat}>
                      <div>Response time</div>
                      <div>{magazine.responseTime || '?'}</div>
                    </div>
                    <div className={styles.cardStat}>
                      <div>Payment</div>
                      <div>{magazine.payment || 'No'}</div>
                    </div>
                    <div className={styles.cardStat}>
                      <div>Twitter followers</div>
                      <div>{magazine.twitterFollowers || '-'}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <Script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js" />
    </div>
  )
}
