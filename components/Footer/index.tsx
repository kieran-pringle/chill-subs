import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { CloseOutline } from 'react-ionicons';
import styles from './Footer.module.scss';

Modal.setAppElement('#__next');

const Footer: React.FC = () => {
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
  const [ suggestionText, setSuggestionText ] = useState<string>('');
  const [ suggestionSubmitted, setSuggestionSubmitted ] = useState<boolean>(false);
  const [ isMobile, setIsMobile ] = useState<boolean>(false);

  useEffect(() => {
    if (window && window.innerWidth <= 600) {
      setIsMobile(true);
    }
  }, [])

  const sendSuggestions = () => {
    const formData = new FormData();
    formData.append('value', suggestionText); 
    fetch('https://script.google.com/macros/s/AKfycbw6d1j3LbF86ArsQfrj0PZuUsYD2qrpGH2W2FUxOchBJEy3oS__PXcU5MiHQRt3zpzGVw/exec', { method: 'POST', mode: "no-cors", body: formData})
      .then(response => setSuggestionSubmitted(true))
      .catch(error => console.error('Error!', error.message))
    setSuggestionText('');
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSuggestionSubmitted(false);
  }

  const customStyles = {
    content: {
      display: 'flex',
      flexDirection: 'column',
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

  return (
    <footer className={styles.footer}>
      <div onClick={() => setIsModalOpen(true)} className={styles.suggestions}>Suggest a magazine or talk to us!</div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {!suggestionSubmitted ? (
          <>
            <div className={styles.modalHeader}>
              <h2>Suggest a magazine or anything else</h2>
              <CloseOutline
                cssClasses={styles.modalClose}
                onClick={closeModal}
                width="32px"
                height="32px"
                color="#316760"
              />
            </div>
            <textarea rows={6} className={styles.textarea} onChange={e => setSuggestionText(e.target.value)} />
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
    </footer>
  )
}

export default Footer;