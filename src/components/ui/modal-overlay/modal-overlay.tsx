import { FC, MouseEvent } from 'react';
import styles from './modal-overlay.module.css';

interface ModalOverlayUIProps {
  onClick: () => void;
}

export const ModalOverlayUI: FC<ModalOverlayUIProps> = ({ onClick }) => {
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    console.log('🟢 ModalOverlayUI - target:', e.target);
    console.log('🟢 ModalOverlayUI - currentTarget:', e.currentTarget);
    console.log(
      '🟢 ModalOverlayUI - should close:',
      e.target === e.currentTarget
    );

    if (e.target === e.currentTarget) {
      console.log('🟢 ModalOverlayUI - calling onClick');
      onClick();
    }
  };

  return <div className={styles.overlay} onClick={handleOverlayClick} />;
};
