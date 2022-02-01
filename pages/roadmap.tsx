import { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import ProgressBar from '@ramonak/react-progress-bar';
import { LogoTwitter, CloseOutline, ChatbubblesOutline } from 'react-ionicons';
import Footer from '../components/Footer';
import styles from '../styles/Roadmap.module.scss'

const allMagazines = [
  'Wrongdoing Magazine', '​the winnow', 'fifth wheel press', 'West Trade Review', 'Lost Balloon',
  'Foglifter', 'NationalPoetryMonth.ca', 'Flash Frog', 'Gordon Square Review',
  'Split Lip', 'MONO.', 'Haiku Crush', 'Alphabet Box', 'The Aurora Journal', 'Pollux Journal',
  'Claw & Blossom', 'indigo lit', 'The Augment Review', 'perhappened', 'warning lines',
  'Honey Lit', 'Tahoma Literary Review', 'SmokeLong Quarterly', 'Atticus Review',
  'Thin Air Magazine', 'unstamatic', 'No Contact', 'Anthra', 'Untoward Magazine',
  'Hippocampus Magazine', 'Crow & Cross Keys', 'Five South', 'ANMLY', 'beestung',
  'Baltimore Review', 'Splonk', 'Farside Review', '(mac)ro(mic)', 'Zero Readers',
  'The Forge', 'STORY', 'Yalobusha Review', 'Post Road', 'Colorado Review', 'Crazyhorse',
  'Nurture', 'Conjunctions', 'Sewanee Review', 'Uncharted', 'Cafe Irreal', 'CRAFT',
  'The Common', 'New Orleans Review', 'Granta', 'Alien Magazine', 'Alaska Quarterly Review', 
  'TriQuarterly', 'Juked', 'New England Review', 'Words & Sports', 'Bat City Review',
  "Lover's Eye Press", 'Takahē', 'The Normal School', 'Sonora Review', 'Afternoon Visitor',
  'bæst', 'Gulf Coast', 'Brevity', 'Ninth Letter', 'High Desert Journal', 'Creative Nonfiction',
  'Fourth Genre', 'Oxford American', 'Sledgehammer Lit', 'Out to Lunch Records', 'Fence',
  'The Threepenny Review', 'The Institutionalized Review', 'Parentheses Journal',
  'The Shore', 'The Hunger Magazine', 'Cease, Cows', 'PANK', 'Dying Dahlia Review',
  'Nightmare', 'Fireside', 'Protean', 'Mithila Review', 'The Plentitudes', 'The Writing Disorder',
  'Months to Years', 'Whale Road Review', 'GASHERJournal', 'The Birdseed', 'Ample Remains',
  'The Lovers', 'Hecate', 'Hypertext Magazine', 'Archer Magazine', 'The Wild Hunt',
  'Milk Candy Review', 'The Bear Creek Gazette', 'Fugitives&Futurists', 'Expat Press',
  'Roi Fainéant Press', 'A Thin Slice of Anxiety', 'Not Deer Magazine', 'Outcast Press',
  'Dishsoap Quarterly', 'Experiment-O', 'The Cardiff Review', 'The Gorko Gazette', 'Fatal Flaw',
  'Here Comes Everyone', 'Vol. 1 Brooklyn', 'One Story', 'Second Chance Lit', 'The Florida Review',
  'The Walled City Journal', 'Reckon Review', 'Miramichi Flash', 'superfroot', 'Space City Underground',
  'Mom Egg Review', 'Oyez Review', 'InvertedSyntax', 'Annulet: A Journal of Poetics',
  'Okay Donkey', 'Overheard', '10000 Minds on Fire', 'Kikwetu', 'The Westchester Review',
  'Memorious', 'Hot Pink', 'Susurrus', 'Papeachu Press', 'Heart of Flesh Literary Journal',
  'DEGENERATE ART', 'Pangyrus', 'Flat Ink', 'The Bureau Dispatch', 'The Boiler',
  'Reclamation Magazine', 'Rogue Agent', 'MASKS Literary Magazine', 'Fine Lines',
  '433', 'Gigantic Sequins', 'Salt Hill Journal', 'The Arkansas International',
  'Class Collective', 'The BeZine Quarterly', 'Oyster River Pages', 'The UNIverse Journal',
  'Expanded Field', 'FEED', 'Discretionary Love', 'Seafront Press', 'New Reader Magazine',
  'Trouvaille Review', 'Jupiter Review', 'Yellow Arrow Journal', 'Defunkt Magazine',
  'Ruminate', 'The Waking', 'Porter House Review', 'A Coup of Owls', 'MOONLOVE',
  'Terror House Magazine', 'Ekstasis Magazine', 'APOCALYPSE CONFIDENTIAL', 'The Ekphrastic Review',
  'Small leaf press', 'Acropolis Journal', 'Pink Plastic House', 'Dead Skunk', 'Bureau of Complaint',
  'Versification Zine', 'The Hyacinth Review', 'Curator Magazine', 'Feminista Journal',
  'Pine Hills Review', 'Emergent Literary', 'Trouble Maker Fire Starter', 'Shorts Magazine',
  'Sans. PRESS', 'Zoetic Press', 'Inertia teens', 'bs/ws', 'Expo Review Lit', 'Cordella Press',
  'Speculative Nonfiction', 'Cutleaf Journal', 'Flashback Fiction', 'LPReview', 'Ember: A Journal of Luminous Things',
  'A Velvet Giant', 'Stone of Madness', 'streetcake magazine', 'Yuzu Press', 'Free Library of the Internet Void',
  'Indiana Review', 'The Masters Review', 'miniskirt magazine', 'Lucky Jefferson', 
  'Always Crashing', 'Couplet Poetry', 'Black Stone / White Stone', 'Kallisto Gaia Press',
  'Signal House Edition', 'No Tokens Journal', 'Nawr', 'Writers Resist', 'Hallaren Lit Mag',
  'Queerlings', 'Powders Press', 
];

export const plannedFeatures = [
  { id: 'genres', title: 'Genre categorization' },
  { id: 'word-count', title: 'Word and line count rules' },
  { id: 'nominations', title: 'Nominations', description: 'Ego loves nominations! We need a filter and info about those!' },
  { id: 'limited-demographic', title: 'Limited demographic info (specific area / young people / women / queer / etc)', description: 'Have a filter for those' },
  { id: 'contests', title: 'Contests', description: 'Have some separate filter for them, and when a place is open for subs, it would indicate whether it’s open for a contest or general submissions' },
  { id: 'editors', title: 'Editors info and links to interviews with them' },
]

export const suggestions = [
  {
    id: 'weird-vibe',
    title: '"Weird / outsider / cross-genre" vibe',
    description: 'As some of you could see in the form, I already named it something like "Weird/unique/outsider shit you have trouble putting labels on" 😶',
    quote: 'I wonder if a box for weird / outsider / cross-genre could work to capture mags like this? They don\'t all fit in the send us your worst bracket like dollar store or bullshit lit for sure',
    author: 'voidskrawl',
  },
  {
    id: 'almost-top-tier',
    title: 'A vibe between Paris Review and "send us your best but less intimidating"',
    description: 'In the beginning I was thinking to include all the "almost top-tier" magazines to the category together with Paris Review, but someone pointed out that these magazines are not quite there:) They were talking about magazines like Crazy Horse, Gulf Coast, Southern Review, Five South, Missouri Review, etc. What do you guys think? Someone else suggest to call the vibe "Send us your fucking best...and we mean it" :D',
    author: 'vemccrary',
  },
  {
    id: 'format',
    title: 'Issues format / continuous posting',
    quote: 'Interested in seeing a checkbox option for magazines that have issues v.s magazines that just post submissions weekly without issues.',
  },
  {
    id: 'theme',
    title: 'Theme / no theme',
    quote: 'maybe a checkbox for themed magazines?'
  },
  {
    id: 'tone',
    title: 'Tone (pastel/light or darker/moodier)',
    quote: 'I\'m not exactly sure how to word this but maybe like tones? Some magazines have a pastel/light style and others are darker/moodier.'
  },
  {
    id: 'aesthetics',
    title: 'Artwork, aesthetics, good presentation',
    quote: 'I wonder if anyone else apart from me cares about the artwork that goes with a piece? For me knowing it\'ll get a great aesthetic and be beautifully presented is definitely a deciding factor',
    author: 'voidskrawl',
  },
  { id: 'multiple-vibes', title: 'Multiple vibes for one magazine' },
  { id: 'translations', title: 'Accepting translations' },
]

export const futureFeatures = [
  { id: 'accounts', title: 'Possibility to log in, save your favorite mags and MORE' },
  { id: 'text-analysis', title: 'Suggest a magazine based on your poem / story - some text analysis shit!' },
  { id: 'books', title: 'Chapbooks / books submissions' },
]

export default function Roadmap() {
  const [ isMobile, setIsMobile ] = useState<boolean>(false);
  const [ magazineList, setMagazineList ] = useState<any[]>([]);
  const [ magazineSearchValue, setMagazineSearchValue ] = useState<string>('');

  useEffect(() => {
    setIsMobile(window.innerWidth <= 600);
    setMagazineList(allMagazines);
  }, [])

  const handleMagazineSearch = e => {
    const { value } = e.target;
    setMagazineSearchValue(value);
    if (!value) {
      setMagazineList(allMagazines.slice(0, 100));
    } else {
      setMagazineList(allMagazines.filter(c => c.toLowerCase().includes(value.toLowerCase())));
    }
  }

  const clearMagazineSearch = () => {
    setMagazineSearchValue('');
    setMagazineList(allMagazines.slice(0, 100));
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
          Roadmap
        </h1>

        <p className={styles.description}>
          Here you can see what I'm working/planning to work on, and view current suggestions:) 
        </p>

        <div className={styles.block}>
          <div className={styles.blockHeader}>
            <div className={styles.blockHeaderEmoji}>🚀</div>
            <h3>In progress</h3>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Adding magazines that filled in the extended form</div>
          </div>
        </div>

        <h2>Features pool</h2>
        
        <div className={styles.block}>
          <div className={styles.blockHeader}>
            <div className={styles.blockHeaderEmoji}>🗓</div>
            <h3>Planned</h3>
          </div>
          {plannedFeatures.map(feature => (
            <Link href={`/feature/${feature.id}`} key={feature.id}>
              <div className={styles.feature}>
                <div className={styles.featureTitle}>{feature.title}</div>
                <div className={styles.featureDiscuss}><ChatbubblesOutline color="#316760" /></div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.block}>
          <div className={styles.blockHeader}>
            <div className={styles.blockHeaderEmoji}>📝</div>
            <h3>Your suggestions</h3>
          </div>
          {suggestions.map(feature => (
            <Link href={`/feature/${feature.id}`} key={feature.id}>
              <div className={styles.feature}>
                <div className={styles.featureTitle}>{feature.title}</div>
                <div className={styles.featureDiscuss}><ChatbubblesOutline color="#316760" /></div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.block}>
          <div className={styles.blockHeader}>
            <div className={styles.blockHeaderEmoji}>👀</div>
            <h3>FUTURE</h3>
          </div>
          {futureFeatures.map(feature => (
            <Link href={`/feature/${feature.id}`} key={feature.id}>
              <div className={styles.feature}>
                <div className={styles.featureTitle}>{feature.title}</div>
                <div className={styles.featureDiscuss}><ChatbubblesOutline color="#316760" /></div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.donate}>
          <span>Wanna help me build things faster?</span> 
          <h2>Consider donating some fuel or become a monthly supporter 🙃 ☕️ 🍺</h2> 
          <div className={styles.monthly}>
            
            <ProgressBar
              completed={13}
              className={styles.progressBarContainer}
              barContainerClassName={styles.progressBar}
              completedClassName={styles.progressBarCompleted}
            />
            <span><strong>$13</strong> of <strong>$100</strong> monthly support goal</span>
          </div>
          <a href="https://www.buymeacoffee.com/karinakupp" target="_blank" rel="noreferrer">
            <button className={styles.button}>Donate</button>
          </a>
        </div>

        <div className={styles.magazines}>
          <h2>Magazine suggestions</h2>
          {/* <span>
            Keep in mind that the list is updated once a day,
            so if you don't see the magazine you suggested today,
            don't worry, it will appear here soon:)
          </span> */}
          <div className={styles.searchContainer}>
            <input
              className={styles.search}
              placeholder="Search..."
              value={magazineSearchValue}
              onChange={handleMagazineSearch}
            />
            {magazineSearchValue && (
              <CloseOutline onClick={clearMagazineSearch} color="#316760" width="24" height="24" />
            )}
          </div>
          <div className={styles.magazinesList}>
            {magazineList?.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1).map((magazine, i) => (
              <div className={styles.magazine} key={magazine}>
                <span>{magazine}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
