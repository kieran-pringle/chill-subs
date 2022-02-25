import { useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router'
import { LogoTwitter } from 'react-ionicons';
import { DiscussionEmbed } from 'disqus-react';
import posts from '!!json5-loader!../../data/posts.json5';
import Footer from '../../components/Footer';
import styles from '../../styles/Post.module.scss'

export default function Post() {
  const router = useRouter();
  const { postId } = router.query;

  const currentPost = posts.find(p => p.slug === postId);

  let disqusConfig: any;
  const disqusShortname = 'chillsubs';

  useEffect(() => {
    if (postId) {
      disqusConfig = {
        url: window.location.href,
        identifier: postId, // Single post id
        title: currentPost?.title // Single post title
      }
    }
  }, [postId])

  if (!currentPost) return null;

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
      <div className={styles.main}>
        <div className={styles.post}>
          <div className={styles.cover}>
            <Image src="/posts/tbq/logo.jpeg" width="160" height="160" />
          </div>
          <h1>{currentPost.title}</h1>
          <div className={styles.postDate}>
            {currentPost.date}
          </div>
          <div className={styles.content}>
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
            </p>

            <p>
              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
            </p>
          </div>
          <DiscussionEmbed
            shortname={disqusShortname}
            config={disqusConfig}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}