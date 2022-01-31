import { useState } from 'react';
import FeedbackForm from '../FeedbackForm';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);

  return (
    <footer className={styles.footer}>
      <div onClick={() => setIsModalOpen(true)} className={styles.suggestions}>Suggest a magazine or talk to us!</div>
      <FeedbackForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </footer>
  )
}

export default Footer;