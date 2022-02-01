import { useState, useEffect } from 'react';
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
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

export default function Browse() {
  const initialResults = favorites.sort((m1, m2) => m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1)
  const [ values, setValues ] = useState<any>({
    search: '',
  });
  const [ results, setResults ] = useState<any[]>(initialResults);
  const [ isMobile, setIsMobile ] = useState<boolean>(false);

  useEffect(() => {
    if (window && window.innerWidth <= 600) {
      setIsMobile(true);
    }
  }, [])

  useEffect(() => {
    setResults(favorites.filter(magazine => {
      let match = true;
      for (const [key, value] of Object.entries(values)) {
        if (key === 'search') {
          const magazineMatch = magazine.name.toLowerCase().includes((value as any).toLowerCase());
          const mId = magazine.name.toLowerCase().replace(/\s/g, '-');
          const { contributors } = contributorsSource.find(m => m.magazineId === mId);
          const contributorMatch = contributors.find(c => c.toLowerCase().includes((value as any).toLowerCase()));
          if (value && !magazineMatch && !contributorMatch) {
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
        } else {
          if (value && !magazine[key]) {
            match = false;
          }
        }
      }
      return match;
    }))
  }, [values])

  const handleValuesChange = (name, value) => {
    setValues({ ...values, [name]: value });
  }

  const sortResults = (option) => {
    let sortedResults = [...results];
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
    } else {
      sortedResults.sort((m1, m2) => m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1)
    }
    setResults(sortedResults);
  }

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
          Search magazines
        </h1>

        <div className={styles.filters}>
          <div className={styles.searchContainer}>
            <div className={styles.label}>Search by magazine or contributor name</div>
            <input
              className={styles.search}
              placeholder="Search..."
              value={values.search}
              onChange={e => handleValuesChange('search', e.target.value)}
            />
            {values.search && (
              <CloseOutline onClick={e => handleValuesChange('search', '')} color="#316760" width="24" height="24" />
            )}
          </div>

          <div className={styles.selectContainer}>
            <div className={styles.label}>Response time</div>
            <Select
              style={! isMobile ? { marginRight: 32, width: 220 } : { marginBottom: 16, width: '100%' }}
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

          <div className={styles.selectContainer}>
            <div className={styles.label}>Vibe</div>
            <Select
              style={!isMobile ? { width: 530 } : { marginBottom: 16, width: '100%'} }
              placeholder="All the vibes"
              options={[
                { value: undefined, title: 'All the vibes' },
                { value: 'bestest', title: 'Very fancy very impressive very not fast' },
                { value: 'best', title: 'Send us your best but less intimidating' },
                { value: 'worst', title: 'Send us your fucking worst' },
                { value: 'chilling', title: 'We\'re just chilling here' },
              ]}
              onSelect={option => handleValuesChange('vibe', option.value)}
            />
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
            options={[
              { value: 'az', dir: 'asc', label: 'Name (A-Z)' },
              { value: 'followersDesc', dir: 'desc', label: 'Twitter followers (high to low)' },
              { value: 'followersAsc', dir: 'asc', label: 'Twitter followers (low to high)' },
              { value: 'deadline', dir: 'asc', label: 'Deadline' },
            ]}
            onSelect={option => sortResults(option)}
          />
        </div>

        <div className={styles.cards}>
          {results.map((magazine, i) => (
            <Link href={`/magazine/${magazine.name.toLowerCase().replace(/\s/g, '-')}`} key={magazine.id}>
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
      <Script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js" />
    </div>
  )
}
