import React from 'react'
import styles from './modal.module.scss'
const Modal = ({ url, onClose }) => {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <span className={styles.closeButton} onClick={onClose}>
            &times;
          </span>
          <img src={url} alt="Transaction Screenshot" className={styles.screenshotImage} />
        </div>
      </div>
    );
  };
  
export default Modal
