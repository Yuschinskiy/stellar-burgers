import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  console.log('🟢 Modal rendered, title:', title, 'onClose:', !!onClose);

  useEffect(() => {
    console.log('🟢 Modal useEffect setup');

    const handleEsc = (e: KeyboardEvent) => {
      console.log('🟢 Escape pressed, key:', e.key);
      if (e.key === 'Escape') {
        console.log('🟢 Calling onClose from Escape');
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      console.log('🟢 Modal cleanup');
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!modalRoot) {
    console.error('🟢 modalRoot not found!');
    return null;
  }

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot
  );
});
