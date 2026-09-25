'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, HelpCircle, X } from 'lucide-react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info' | 'success' | 'warning' | 'confirm'
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
  });

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback((titleOrMessage, messageText = '', type = 'info') => {
    let title = 'Notification';
    let message = '';

    if (!messageText && typeof titleOrMessage === 'string') {
      message = titleOrMessage;
    } else {
      title = titleOrMessage;
      message = messageText;
    }

    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type,
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {
          closeModal();
          resolve(true);
        },
        onCancel: () => {
          closeModal();
          resolve(true);
        }
      });
    });
  }, [closeModal]);

  const showConfirm = useCallback((titleOrMessage, messageOrOptions, options = {}) => {
    let title = 'Confirm Action';
    let message = '';
    let opts = {};

    if (typeof titleOrMessage === 'string' && typeof messageOrOptions === 'string') {
      title = titleOrMessage;
      message = messageOrOptions;
      opts = options;
    } else if (typeof titleOrMessage === 'string' && !messageOrOptions) {
      message = titleOrMessage;
    } else if (typeof titleOrMessage === 'object') {
      opts = titleOrMessage;
      title = opts.title || 'Confirm Action';
      message = opts.message || '';
    }

    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type: opts.type || 'confirm',
        confirmText: opts.confirmText || 'Confirm',
        cancelText: opts.cancelText || 'Cancel',
        onConfirm: () => {
          closeModal();
          if (opts.onConfirm) opts.onConfirm();
          resolve(true);
        },
        onCancel: () => {
          closeModal();
          if (opts.onCancel) opts.onCancel();
          resolve(false);
        }
      });
    });
  }, [closeModal]);

  const getIcon = () => {
    switch (modalState.type) {
      case 'success':
        return <CheckCircle2 style={{ width: 32, height: 32, color: '#10B981' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: 32, height: 32, color: '#F59E0B' }} />;
      case 'confirm':
        return <HelpCircle style={{ width: 32, height: 32, color: '#0FB3B6' }} />;
      case 'info':
      default:
        return <Info style={{ width: 32, height: 32, color: '#3B82F6' }} />;
    }
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, closeModal }}>
      {children}
      {modalState.isOpen && (
        <div className="custom-modal-overlay open" onClick={modalState.onCancel || closeModal}>
          <div
            className="custom-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="custom-modal-close-btn"
              onClick={modalState.onCancel || closeModal}
              aria-label="Close modal"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div className="custom-modal-body">
              <div className="custom-modal-icon">{getIcon()}</div>
              <h3 className="custom-modal-title">{modalState.title}</h3>
              <p className="custom-modal-message">{modalState.message}</p>
            </div>

            <div className="custom-modal-actions">
              {modalState.cancelText && (
                <button
                  type="button"
                  className="custom-modal-btn cancel"
                  onClick={modalState.onCancel || closeModal}
                >
                  {modalState.cancelText}
                </button>
              )}
              <button
                type="button"
                className={`custom-modal-btn confirm ${modalState.type}`}
                onClick={modalState.onConfirm || closeModal}
                autoFocus
              >
                {modalState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      showAlert: (msg) => { alert(msg); return Promise.resolve(true); },
      showConfirm: (msg) => { return Promise.resolve(window.confirm(msg)); },
      closeModal: () => {}
    };
  }
  return context;
}
