import { useEffect, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faEnvelope,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import styles from './MarketingModal.module.css';

export type MarketingModalVariant = 'welcome' | 'lead';

export type MarketingModalProps = {
  variant: MarketingModalVariant;
  open: boolean;
  onClose: () => void;
  onPrimary?: () => void;
  onLater?: () => void;
};

const welcomeCopy = {
  header: 'Herzlich willkommen Ihr schneller Einstieg',
  title: 'In 3 Schritten vom Erstkontakt bis zur Wiedervorlage',
  subtitle:
    'In nur 2 Minuten sehen Sie, wie Sie Anfragen effizient bearbeiten und jederzeit den Überblick behalten.',
  benefits: [
    'Neue Interessenten sofort kontaktieren',
    'Den gesamten Prozess im Blick behalten',
  ],
  primary: 'Video jetzt ansehen',
};

const leadCopy = {
  header: 'Vielen Dank für Ihre Rückmeldung!',
  title: 'Ihr kostenloser Testzugang zum Anfragen-Manager',
  subtitle:
    'Testen Sie jetzt, wie einfach Sie Anfragen verwalten und direkt auf Kontakte zugreifen können – völlig kostenlos und ohne Vertrag.',
  benefits: [
    'Kostenlos, vollen Funktionsumfang erleben',
    'Selbst überzeugen, dann entscheiden',
  ],
  primary: 'Kostenlos testen',
};

export function MarketingModal({
  variant,
  open,
  onClose,
  onPrimary,
  onLater,
}: MarketingModalProps) {
  const titleId = useId();
  const leadFormId = useId();
  const copy = variant === 'welcome' ? welcomeCopy : leadCopy;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handlePrimary = () => {
    onPrimary?.();
  };

  const handleLater = () => {
    if (onLater) onLater();
    else onClose();
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Schließen">
          ×
        </button>
        <div id={titleId} className={styles.header}>
          {copy.header}
        </div>
        <div className={styles.body}>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.subtitle}>{copy.subtitle}</p>

          {variant === 'welcome' && (
            <div className={styles.videoWrap}>
              <div className={styles.videoBlur} aria-hidden />
              <button type="button" className={styles.playBtn} aria-label="Video abspielen">
                <span className={styles.playIcon} />
              </button>
            </div>
          )}

          <div className={variant === 'welcome' ? `${styles.benefits} ${styles.benefitsLast}` : styles.benefits}>
            <ul className={styles.benefitsList}>
              {copy.benefits.map((text) => (
                <li key={text} className={styles.benefitItem}>
                  <FontAwesomeIcon icon={faCircleCheck} className={styles.checkIcon} aria-hidden />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {variant === 'lead' && (
            <form
              id={leadFormId}
              className={styles.fieldGroup}
              onSubmit={(e) => {
                e.preventDefault();
                handlePrimary();
              }}
            >
              <label className={styles.field}>
                <FontAwesomeIcon icon={faUser} className={styles.fieldIcon} aria-hidden />
                <input className={styles.input} name="name" placeholder="Name" autoComplete="name" />
              </label>
              <label className={styles.field}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.fieldIcon} aria-hidden />
                <input
                  className={styles.input}
                  name="email"
                  type="email"
                  placeholder="E-Mail"
                  autoComplete="email"
                />
              </label>
              <label className={styles.field}>
                <FontAwesomeIcon icon={faPhone} className={styles.fieldIcon} aria-hidden />
                <input
                  className={styles.input}
                  name="phone"
                  type="tel"
                  placeholder="Telefonnummer"
                  autoComplete="tel"
                />
              </label>
            </form>
          )}
        </div>
        <div className={styles.footer}>
          {variant === 'lead' ? (
            <button type="submit" form={leadFormId} className={styles.primary}>
              {copy.primary}
            </button>
          ) : (
            <button type="button" className={styles.primary} onClick={handlePrimary}>
              {copy.primary}
            </button>
          )}
          <button type="button" className={styles.later} onClick={handleLater}>
            Später
          </button>
        </div>
      </div>
    </div>
  );
}
