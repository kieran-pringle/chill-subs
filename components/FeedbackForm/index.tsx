import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { CloseOutline } from 'react-ionicons';
import styles from './FeedbackForm.module.scss';

Modal.setAppElement('#__next');

const FeedbackForm = (props) => {
  const { isModalOpen, setIsModalOpen } = props;
  const [ suggestionHandle, setSuggestionHandle ] = useState<string>('');
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
    formData.append('twitter', suggestionHandle);
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

  return (
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
          <div className={styles.field}>
            <div className={styles.label}>Your Twitter handle (optional)</div>
            <input className={styles.input} onChange={e => setSuggestionHandle(e.target.value)} />
          </div>
          <div className={styles.field}>
            <div className={styles.label}>Suggestion text</div>
            <textarea rows={6} className={styles.textarea} onChange={e => setSuggestionText(e.target.value)} />
          </div>
          <div className={styles.magazineForm}>
            <div className={styles.magazineFormTitle}>Extended magazine suggestion form for super humans ⬇️</div>
            <div className={styles.magazineFormText}>It would help A LOT if you filled in at least some of the details in the following form:) It will save me some time, and I can use it to generate cool ideas 😎</div>
            <a href="https://docs.google.com/forms/d/1ujyhy9ZfKPgNVB1waDHAcGW90jy15Y92xBYi_jCcm8c/edit" target="_blank">Go to the magazine form</a>
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
}

export default FeedbackForm;