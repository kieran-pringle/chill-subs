import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Script from 'next/script'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Modal from 'react-modal';
import { AddOutline, BookOutline, CloseOutline, GlobeOutline, LogoTwitter, LogoInstagram } from 'react-ionicons';
import { iconsByName } from '../../utils/iconsByName';
import favorites from '!!json5-loader!../../data/favorites.json5';
import examplesSource from '!!json5-loader!../../data/examples.json5';
import contributorsSource from '!!json5-loader!../../data/contributors.json5';
import Footer from '../../components/Footer';
import { vibeOptions } from '../browse';
import styles from '../../styles/Magazine.module.scss';

Modal.setAppElement('#__next');

export default function Magazine() {
  const [ modal, setModal ] = useState<string | null>(null);
  const [ suggestionHandle, setSuggestionHandle ] = useState<string>('');
  const [ suggestionText, setSuggestionText ] = useState<string>('');
  const [ suggestionSubmitted, setSuggestionSubmitted ] = useState<boolean>(false);
  const [ contributorSearchValue, setContributorSearchValue ] = useState<string>('');
  const router = useRouter();
  const { magazineId } = router.query;
  const currentMagazine = favorites.find(m => m.key === magazineId);
  const [ allContributors, setAllContributors ] = useState<any>([]);
  const [ contributorList, setContributorList ] = useState<any>([]);

  const [ isMobile, setIsMobile ] = useState<boolean>(false);

  useEffect(() => {
    if (window && window.innerWidth <= 600) {
      setIsMobile(true);
    }
  }, [])

  const sortByLastName = list => {
    return list.sort((a, b) => {
      const namePartsA = a.split(' ');
      const namePartsB = b.split(' ');
      const firstNameA = namePartsA[0];
      const firstNameB = namePartsB[0];
      const lastNameA = namePartsA[namePartsA.length -1];
      const lastNameB = namePartsB[namePartsB.length -1];
      if (lastNameA === lastNameB) {
        return firstNameA > firstNameB ? 1 : -1;
      } else {
        return lastNameA > lastNameB ? 1 : -1
      }
    })
  }

  useEffect(() => {
    if (magazineId) {
      const { contributors } = contributorsSource.find(c => c.magazineId === magazineId);
      setAllContributors(sortByLastName(contributors));
      setContributorList(sortByLastName(contributors.slice(0, 100)));
    }
  }, [magazineId])

  const sendSuggestions = () => {
    const formData = new FormData();
    formData.append('twitter', suggestionHandle);
    formData.append('magazine', currentMagazine.name);
    formData.append('type', modal);
    formData.append('value', suggestionText); 
    fetch('https://script.google.com/macros/s/AKfycbzkve_uTUHCaVIIchiTNg9LxdaroBgifcE-KwRipI-LOrJ9E_gl5pYhtlPojhi3p6upYA/exec', { method: 'POST', mode: "no-cors", body: formData})
      .then(response => setSuggestionSubmitted(true))
      .catch(error => console.error('Error!', error.message))
    setSuggestionText('');
  }

  const closeModal = () => {
    setModal(null);
    setSuggestionSubmitted(false);
  }

  const handleContributorSearch = e => {
    const { value } = e.target;
    setContributorSearchValue(value);
    if (!value) {
      setContributorList(sortByLastName(allContributors.slice(0, 100)));
    } else {
      setContributorList(allContributors.filter(c => c.toLowerCase().includes(value.toLowerCase())));
    }
  }

  const clearContributorSearch = () => {
    setContributorSearchValue('');
    setContributorList(sortByLastName(allContributors.slice(0, 100)));
  }

  const handleShowMore = () => {
    const currentPosition = contributorList.length; 
    if (contributorList.length + 100 <= allContributors.length) {
      const updatedList = [ ...contributorList, ...allContributors.slice(currentPosition, currentPosition + 100)];
      setContributorList(sortByLastName(updatedList));
    } else {
      setContributorList(sortByLastName(allContributors));
    }
  }

  const getContributorId = contributor => {
    return contributor.replace(/\s/g, '_');
  }

  const customStyles = {
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      padding: !isMobile ? '2.5rem' : '1.75rem',
      width: !isMobile ? '36rem' : '100%',
      height: !isMobile ? 'auto' : '100%',
      border: 'none',
      borderRadius: !isMobile ? 12 : 0,
      transform: 'translate(-50%, -50%)',
      color: '#316760',
    },
    overlay: {
      zIndex: 999,
      background: 'rgba(0, 0, 0, 0.5)',
    }
  };

  if (!currentMagazine) return null;

  const { examples } = examplesSource.find(e => e.magazineId === magazineId);

  const suggestionModal = (
    <Modal
      isOpen={modal ? true : false}
      onRequestClose={closeModal}
      style={customStyles}
    >
      {!suggestionSubmitted ? (
        <>
          <div className={styles.modalHeader}>
            {modal === 'niceThing' ? (
              <h2>Share a nice thing about {currentMagazine.name} :)</h2>
            ) : (
              <h2>Share an issue for {currentMagazine.name}</h2>
            )}
            <CloseOutline
              cssClasses={styles.modalClose}
              onClick={() => setModal(null)}
              width="32px"
              height="32px"
              color="#316760"
            />
          </div>
          <span>We'll review it and add it to the list :)</span>
          <div className={styles.field}>
            <div className={styles.label}>Your Twitter handle (optional)</div>
            <input className={styles.input} onChange={e => setSuggestionHandle(e.target.value)} />
          </div>
          <div className={styles.field}>
            <div className={styles.label}>Suggestion</div>
            <textarea rows={6} className={styles.textarea} onChange={e => setSuggestionText(e.target.value)} />
          </div>
          <button className={`${styles.btn} ${styles.modalBtn}`} onClick={sendSuggestions}>Send</button>
        </>
      ) : (
        <div className={styles.successContainer}>
          <div className={styles.successEmoji}>
            👌
          </div>
          <div className={styles.success}>
            <div className={styles.successText}>You're the best. We'll look at your suggestions soon!</div>
          </div>
          <div className={`${styles.btn} ${styles.successBtn}`} onClick={closeModal}>Keep browsing</div>
        </div>
      )}
    </Modal>
  )
  
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
        <div className={styles.header}>
          <Image src={currentMagazine.cover || ''} width={120} height={120} />
          <h1 className={styles.title}>{currentMagazine.name}</h1>
          <div className={styles.description}>{`"${currentMagazine.description}"`}</div>
          <div className={styles.contacts}>
            <a href={currentMagazine.website} className={styles.contact} target="_blank" rel="noreferrer">
              <GlobeOutline cssClasses={styles.contactIcon} />
            </a>
            {currentMagazine.twitter && (
              <a href={currentMagazine.twitter} className={styles.contact} target="_blank" rel="noreferrer">
                <LogoTwitter cssClasses={styles.contactIcon} />
              </a>
            )}
            {currentMagazine.insta && (
              <a href={currentMagazine.insta} className={styles.contact} target="_blank" rel="noreferrer">
                <LogoInstagram cssClasses={styles.contactIcon} />
              </a>
            )}
          </div>
          <div className={styles.openAndVibe}>
            {currentMagazine.open && (
              <div className={`${styles.stat} ${styles.openStat}`}>
                <div>Open:</div>
                <div>Yes{currentMagazine.deadline && `, till ${currentMagazine.deadline}`}</div>
              </div>
            )}
            <div className={styles.vibe}>
              {/* <div className={styles.vibeEmoji}>🔮</div> */}
              <strong>Vibe: </strong>
              {vibeOptions.find(v => v.value === currentMagazine.vibe).title}
            </div>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div>Response time:</div>
              <div>{currentMagazine.responseTime || '?'}</div>
            </div>
            <div className={styles.stat}>
              <div>Payment:</div>
              <div>{currentMagazine.payment || 'No'}</div>
            </div>
            <div className={styles.stat}>
              <div>Simultaneous submissions:</div>
              <div>{currentMagazine.simultaneousSubmissions ? 'Yes' : 'No'}</div>
            </div>
            <div className={styles.stat}>
              <div>Previously published:</div>
              <div>{currentMagazine.acceptPreviouslyPublished ? 'Yes' : 'No'}</div>
            </div>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div>Submission fee:</div>
              <div>{currentMagazine.fee || 'Free'}</div>
            </div>
            <div className={styles.stat}>
              <div>Expedited submissions:</div>
              <div>{currentMagazine.expeditedResponse ? 'Yes' : 'No'}</div>
            </div>
            <div className={styles.stat}>
              <div>Available in print:</div>
              <div>{currentMagazine.print ? 'Yes' : 'No'}</div>
            </div>
            <div className={styles.stat}>
              <div>Examples online:</div>
              <div>{currentMagazine.freeExamples ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
        <div className={styles.prosCons}>
          <div className={styles.card}>
            <h3>Nice things</h3>
            <ul>
              {currentMagazine.pros.map((pro, i) => (
                <li key={i}>
                  {iconsByName[pro.icon]}
                  {`  ${pro.title}`}
                </li>
              ))}
            </ul>
            <button onClick={() => setModal('niceThing')} className={styles.btn}>
              <AddOutline cssClasses={styles.icon} width={20} height={20} />
              Suggest a nice thing :)
            </button>
          </div>
          <div className={styles.card}>
            <h3>Potential issues</h3>
            <ul>
              {currentMagazine.cons.map((con, i) => (
                <li key={i}>
                  {iconsByName[con.icon]}
                  {con.title}
                </li>
              ))}
            </ul>
            <button onClick={() => setModal('issue')} className={styles.btn}>
              <AddOutline cssClasses={styles.icon} width={20} height={20} />
              Suggest an issue
            </button>
          </div>
        </div>
        <h2>Genres</h2>
        <div className={styles.genres}>
          {currentMagazine.genres.map(g => (
            <div className={styles.genre} key={g.value}>
              <div className={styles.genreHeader}>
                <div className={styles.genreEmoji}>👌</div>
                <h3>{g.value[0].toUpperCase() + g.value.slice(1)}</h3>
              </div>
              <div className={styles.genreContent}>
                {g.maxWords && <span>Max words: {g.maxWords}</span>}
                {g.maxLines && <span>Max lines: {g.maxLines}</span>}
                {g.min && <span>Min pieces: {g.min}</span>}
                {g.max && <span>Max pieces: {g.max}</span>}
                {g.additional && <span>{g.additional}</span>}
                {!g.maxWords && !g.maxLines && !g.min && !g.max && !g.additional && (
                  <span>No specific limitations</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <h2>Examples</h2>
        <div className={styles.examples}>
          {examples?.length ? (
            examples.map((example, i) => (
              <div className={styles.example} key={i}>
                <h3>'{example.title}' by {example.author}</h3>
                <div className={styles.exampleContent}>
                  <span className={styles.excerpt}>(excerpt)</span>
                  <div className={styles.exampleText}>{example.text}</div>
                  {/* <span className={styles.excerpt}>... (excerpt end)</span> */}
                </div>
                <a href={example.link} target="_blank" rel="noreferrer">
                  <BookOutline cssClasses={styles.icon} />
                  Read the full piece in the magazine
                </a>
              </div>
            ))
          ) : (
            <div>Examples are coming :) (or not available)</div>
          )}
        </div>
        <h2>Contributors</h2>
        {allContributors.length ? (
          <>
            <div className={styles.searchContainer}>
              <input
                className={styles.search}
                placeholder="Search..."
                value={contributorSearchValue}
                onChange={handleContributorSearch}
              />
              {contributorSearchValue && (
                <CloseOutline onClick={clearContributorSearch} color="#316760" width="24" height="24" />
              )}
            </div>
            <div className={styles.contributors}>
              {contributorList?.sort((a, b) => a.toLowerCase().split(' ').slice(-1) > b.toLowerCase().split(' ').slice(-1) ? 1 : -1).map((contributor, i) => (
                <Link href={`/contributor/${getContributorId(contributor)}`} key={i}>
                  <div className={styles.contributor}>
                    <span>{contributor}</span>
                  </div>
                </Link>
              ))}
            </div>
            {!contributorSearchValue && contributorList.length < allContributors.length && (
              <div className={styles.showMore} onClick={handleShowMore}>Show more</div>
            )}
          </>
        ) : (
          <div className={styles.contributorsEmpty}>
            Contributors are coming :) <br /> <br />
            (or not, maybe it's too many of them)
          </div>
        )}
        {suggestionModal}
      </main>

      <Footer />
      <Script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js" />
    </div>
  )
}
