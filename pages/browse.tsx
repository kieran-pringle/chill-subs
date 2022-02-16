import { useState, useEffect } from 'react';
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { format } from 'date-fns';
import ReactTooltip from 'react-tooltip';
import { CloseOutline, LogoTwitter, TimeOutline } from 'react-ionicons';
import favorites from '!!json5-loader!../data/favorites.json5';
import contributorsSource from '!!json5-loader!../data/contributors.json5';
import Checkbox from '../components/Checkbox';
import Footer from '../components/Footer';
import Select from '../components/Select';
import SortSelect from '../components/SortSelect';
import styles from '../styles/Browse.module.scss'

// size - select - smaller, popular but fun, popular but not like "the fanciest", very fucking fancy
// targets specific demographic - select (lgbt, black, bipoc, latinx, women, specific country, young, old)
// nominate for awards - checkbox
// new (accepting their first submissions :) ) - checkbox
// have 24h submission windows

export const vibeOptions = [
  { value: undefined, title: 'All the vibes' },
  { value: 'bestest', title: 'Very fancy very impressive very not fast' },
  { value: 'bester', title: 'Top-tier stuff. Not Paris Review, but ok' },
  { value: 'best', title: 'Send us your best but less intimidating' },
  { value: 'worst', title: 'Send us your fucking worst' },
  { value: 'weird', title: 'Weird / outsider / wtf even is it' },
  { value: 'chilling', title: 'We\'re just chilling here' },
];

export const genreOptions = [
  { value: undefined, title: 'Any genre' },
  { value: 'fiction', title: 'Fiction' },
  { value: 'nonfiction', title: 'Nonfiction' },
  { value: 'poetry', title: 'Poetry' },
  { value: 'hybrid', title: 'Hybrid' },
  { value: 'review', title: 'Review' },
  { value: 'interview', title: 'Interview' },
  { value: 'art', title: 'Art' },
  { value: 'photography', title: 'Photography' },
  { value: 'comics', title: 'Comics' },
  { value: 'audio', title: 'Audio' },
  { value: 'video', title: 'Video' },
  { value: 'game', title: 'Game' },
  { value: 'anything', title: 'Wtf is genre, send anything' },
  // { value: 'anything', title: 'Anything, send us anything' },
];

export const wordCountOptions = [
  { max: undefined, title: 'Any' },
  { min: 0, value: 1000, title: 'Under 1000 words' },
  { min: 1000, value: 2000, title: '1000 - 2000 words' },
  { min: 2000, value: 3000, title: '2000 - 3000 words' },
  { min: 3000, value: 4000, title: '3000 - 4000 words' },
  { min: 4000, value: 5000, title: '4000 - 5000 words' },
  { min: 5000, value: 6000, title: '5000 - 6000 words' },
  { min: 6000, value: 10000, title: '6000 - 10000 words' },
];

export const demographicOptions = [
  { value: undefined, title: 'All creators' },
  { value: 'location', title: 'Focus on specific location or ethnic group' },
  { value: 'marginalized', title: 'Focus on all marginalized creators' },
  { value: 'lgbt', title: 'Focus on LGBTQ+ creators' },
  { value: 'womenAndNonbinary', title: 'Focus on women and nonbinary creators' },
  { value: 'young', title: 'Focus on work from young creators' },
];

export default function Browse() {
  const router = useRouter();
  const [ values, setValues ] = useState<any>({
    magazineSearch: '',
    contributorSearch: '',
  });
  const sortOptions = [
    { value: 'az', dir: 'asc', label: 'Name (A-Z)' },
    { value: 'followersDesc', dir: 'desc', label: 'Twitter followers (high to low)' },
    { value: 'followersAsc', dir: 'asc', label: 'Twitter followers (low to high)' },
    { value: 'deadline', dir: 'asc', label: 'Deadline' },
    { value: 'added', dir: 'desc', label: 'Recently added' },
  ];
  const [ results, setResults ] = useState<any[]>([]);
  const [ isMobile, setIsMobile ] = useState<boolean>(false);
  const [ sortBy, setSortBy ] = useState<any>(sortOptions[0]);
  const [ isFilterUsed, setIsFilterUsed ] = useState<boolean>(false);

  useEffect(() => {
    if (window && window.innerWidth <= 1024) {
      setIsMobile(true);
    }
  }, [])

  useEffect(() => {
    if (window.location.pathname.includes('/browse')) {
      let updatedResults = [];
      let searchParams = new URLSearchParams(window.location.search.slice(1));
      const sortByOption = searchParams.get('sortBy');
      if (sortByOption) {
        const option = sortOptions.find(o => o.value === sortByOption);
        updatedResults = handleSort(option, results.length ? results : favorites);
        setResults(updatedResults);
      } else {
        updatedResults = handleSort(sortOptions[0], results.length ? results : favorites);
        setResults(updatedResults);
      }
    }
  }, [router.query.sortBy])

  useEffect(() => {
    if (isFilterUsed) {
      const filteredResults = favorites.filter(magazine => {
        let match = true;
        for (const [key, value] of Object.entries(values)) {
          if (key === 'magazineSearch') {
            const magazineMatch = magazine.name.toLowerCase().includes((value as any).toLowerCase());
            if (value && !magazineMatch) {
              match = false;
            }
          } else if (key === 'contributorSearch') {
            const { contributors } = contributorsSource.find(m => m.magazineId === magazine.key);
            const contributorMatch = contributors.find(c => c.toLowerCase().includes((value as any).toLowerCase()));
            if (value && !contributorMatch) {
              match = false;
            }
          } else if (key === 'responseTime') {
            if (value && (!magazine.responseDays || magazine.responseDays > value) ) {
              match = false;
            }
          } else if (key === 'noFee') {
            if (value && magazine.fee) {
              match = false;
            }
          } else if (key === 'vibe') {
            if (value && magazine[key] !== value) {
              match = false;
            }
          } else if (key === 'genre') {
            const magazineGenreKeys = magazine.genres.map(g => g.value);
            if (value && !magazineGenreKeys.includes(value)) {
              match = false;
            }
          } else if (key === 'wordCount') {
            const genreMatch = magazine.genres.find(g => g.value === values.genre);
            if (value && !genreMatch) {
              match = false;
            } else {
              if (value && genreMatch && !genreMatch.maxWords) {
                match = false;
              }
              if (value && genreMatch && (genreMatch.maxWords < Number(value) || (genreMatch.minWords ? genreMatch.minWords > Number(value) : false))) {
                match = false;
              }
            }
          } else if (key === 'demographic') {
            if (value && (!magazine.demographic || !magazine.demographic.includes(value))) {
              match = false;
            }
          } else {
            if (value && !magazine[key]) {
              match = false;
            }
          }
        }
        return match;
      })
  
      let updatedResults = handleSort(sortBy, filteredResults);
      setResults(updatedResults);
    }
  }, [values])

  const handleValuesChange = (name, value) => {
    setIsFilterUsed(true);
    setValues({ ...values, [name]: value });
  }

  const handleSort = (option, list?) => {
    setSortBy(option);
    let sortedResults = list ? [...list] : [...results];
    if (option.value === 'followersDesc') {
      sortedResults.sort((m1, m2) => m1.twitterFollowers < m2.twitterFollowers ? 1 : -1)
    } else if (option.value === 'followersAsc') {
      sortedResults.sort((m1, m2) => m1.twitterFollowers >= m2.twitterFollowers ? 1 : -1)
    } else if (option.value === 'deadline') {
      const haveDeadline = sortedResults.filter(m => m.deadline);
      const withoutDeadline = sortedResults.filter(m => !m.deadline);
      sortedResults = [
        ...haveDeadline.sort((m1, m2) => {
          const m1Deadline: any = new Date(m1.deadline);
          const m2Deadline: any = new Date(m2.deadline);
          return m1Deadline - m2Deadline;
        }),
        ...withoutDeadline,
      ]
    } else if (option.value === 'added') {
      sortedResults.sort((m1, m2) => m1.id < m2.id ? 1 : -1)
    } else {
      sortedResults.sort((m1, m2) => m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1)
    }
    return sortedResults;
  }

  const sortResults = (option) => {
    router?.replace({ query: { ...router.query, sortBy: option.value } }, undefined, { shallow: true });
  }

  const showWordCountSelect = values.genre === 'fiction' || values.genre === 'nonfiction' || values.genre === 'hybrid';

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
          Search magazines
        </h1>

        <div className={styles.filters}>
          <div className={styles.searchContainer}>
            <div className={styles.label}>Search by magazine name</div>
            <input
              className={styles.search}
              placeholder="Search..."
              value={values.magazineSearch}
              onChange={e => handleValuesChange('magazineSearch', e.target.value)}
            />
            {values.magazineSearch && (
              <CloseOutline onClick={e => handleValuesChange('magazineSearch', '')} color="#316760" width="24" height="24" />
            )}
          </div>

          <div className={styles.searchContainer}>
            <div className={styles.label}>Search by contributor name</div>
            <input
              className={styles.search}
              placeholder="Search..."
              value={values.contributorSearch}
              onChange={e => handleValuesChange('contributorSearch', e.target.value)}
            />
            {values.contributorSearch && (
              <CloseOutline onClick={e => handleValuesChange('contributorSearch', '')} color="#316760" width="24" height="24" />
            )}
          </div>

          <div className={styles.selectContainer}>
            <div className={styles.label}>Response time</div>
            <Select
              style={!isMobile ? { width: 300 } : { marginBottom: 16, width: '100%' }}
              placeholder="Any time"
              options={[
                { value: undefined, title: 'Any time' },
                { value: 7, title: 'Within 1 week' },
                { value: 30, title: 'Within 1 month' },
                { value: 90, title: 'Within 3 months' },
                { value: 180, title: 'Within 6 months' },
              ]}
              onSelect={option => handleValuesChange('responseTime', option.value)}
            />
          </div>

          <div className={styles.selectRow}>
            <div className={styles.selectContainer}>
              <div className={styles.label}>Vibe</div>
              <Select
                style={!isMobile ? { marginRight: 32, width: 410 } : { marginBottom: 16, width: '100%'} }
                placeholder="All the vibes"
                options={vibeOptions}
                onSelect={option => handleValuesChange('vibe', option.value)}
              />
            </div>

            <div className={styles.selectContainer}>
              <div className={styles.label}>Accepting genre</div>
              <Select
                style={!isMobile ? { marginRight: 32, width: 300 } : { marginBottom: 16, width: '100%'} }
                placeholder="Any genre"
                options={genreOptions}
                onSelect={option => handleValuesChange('genre', option.value)}
              />
            </div>

            {showWordCountSelect && (
              <div className={`${styles.searchContainer} ${styles.wordCountContainer}`}>
                <div className={styles.label}>Your piece word count</div>
                <input
                  className={styles.search}
                  placeholder=""
                  value={values.wordCount}
                  onChange={e => handleValuesChange('wordCount', e.target.value)}
                />
                {values.wordCount && (
                  <CloseOutline onClick={e => handleValuesChange('wordCount', '')} color="#316760" width="24" height="24" />
                )}
              </div>
            )}

            <div className={styles.selectContainer} style={{ marginTop: showWordCountSelect && !isMobile ? 24 : 0 }}>
              <div className={styles.label}>Specific demographic</div>
              <Select
                style={!isMobile ? { width: 410 } : { marginBottom: 16, width: '100%'} }
                placeholder="All creators"
                options={demographicOptions}
                onSelect={option => handleValuesChange('demographic', option.value)}
              />
            </div>
          </div>

        </div>

        <div className={styles.filters}>

          <Checkbox
            name="open"
            label="Open for submissions"
            className={styles.checkbox}
            onChange={e => handleValuesChange('open', e.target.checked)}
          />

          <Checkbox
            name="expedited"
            label="Offer expedited submissions"
            className={styles.checkbox}
            onChange={e => handleValuesChange('expeditedResponse', e.target.checked)}
          />

          <Checkbox
            name="expedited"
            label="Built around a specific theme"
            className={styles.checkbox}
            onChange={e => handleValuesChange('theme', e.target.checked)}
          />

        </div>

        <div className={styles.filters}>

          <div className={styles.filterBlock}>
            <div className={styles.filterBlockTitle}>Basic human needs</div>
            
            <Checkbox
              name="simSubs"
              label="Simultaneous submissions"
              className={styles.checkbox}
              onChange={e => handleValuesChange('simultaneousSubmissions', e.target.checked)}
            />

            <Checkbox
              name="previouslyPublished"
              label="Previously published OK"
              className={styles.checkbox}
              onChange={e => handleValuesChange('acceptPreviouslyPublished', e.target.checked)}
            />

          </div>

          <div className={styles.filterBlock}>
            <div className={styles.filterBlockTitle}>Money</div>
            
            <Checkbox
              name="noFee"
              label="No submission fee"
              className={styles.checkbox}
              onChange={e => handleValuesChange('noFee', e.target.checked)}
            />

            <Checkbox
              name="payment"
              label="Paying publication"
              className={styles.checkbox}
              onChange={e => handleValuesChange('payment', e.target.checked)}
            />
          </div>

          <div className={styles.filterBlock}>
            <div className={styles.filterBlockTitle}>Promotion and hype</div>

            <Checkbox
              name="activeOnSocials"
              label="Active on social media"
              className={styles.checkbox}
              onChange={e => handleValuesChange('activeOnSocials', e.target.checked)}
            />

            <Checkbox
              name="promoteAfterPublication"
              label="Promote after publication"
              className={styles.checkbox}
              onChange={e => handleValuesChange('promoteAfterPublication', e.target.checked)}
            />
          </div>

          <div className={styles.filterBlock}>
            <div className={styles.filterBlockTitle}>Availability</div>

            <Checkbox
              name="print"
              label="Available in print"
              className={styles.checkbox}
              onChange={e => handleValuesChange('print', e.target.checked)}
            />

            <Checkbox
              name="online"
              label="Has examples online"
              className={styles.checkbox}
              onChange={e => handleValuesChange('freeExamples', e.target.checked)}
            />
          </div>
        </div>

        <div className={styles.browseHeader}>
          <h2>Browse</h2>
          <SortSelect
            options={sortOptions}
            defaultValue={sortBy}
            onSelect={option => sortResults(option)}
          />
        </div>

        <div className={styles.cards}>
          {results.map((magazine, i) => (
            <Link href={`/magazine/${magazine.key}`} key={magazine.id}>
              <div className={styles.card}>
                {magazine.open && (
                  magazine.deadline ? (
                    <div className={styles.open} data-tip="Submission deadline">
                      <div className={styles.deadlineIcon}>
                        <TimeOutline width="16px" height="16px" color="#fff" />
                      </div>
                      <ReactTooltip place="bottom" arrowColor="#efefef" className={styles.tooltip} />
                      {format(new Date(magazine.deadline), 'MMM d')}
                    </div>
                  ) : (
                    <div className={styles.open}>
                      Open
                    </div>
                  )
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

      </main>

      <Footer />
    </div>
  )
}
