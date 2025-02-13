'use client';

import { useState } from 'react';
import styles from '@/styles/WinnersModal.module.css';

interface Winner {
  name: string;
  number: number;
  amount: number;
}

interface WinnersModalProps {
  winners: Winner[];
  onClose: () => void;
}

export default function WinnersModal({ winners, onClose }: WinnersModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón para abrir el modal */}
      <button className={styles.openButton} onClick={() => setIsOpen(true)}>
        📜 Ver Estadísticas
      </button>

      {/* Modal */}
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.title}>🏆 Historial de Ganadores 🏆</h2>
            <ul className={styles.winnerList}>
              {winners.length > 0 ? (
                winners.map((winner, index) => (
                  <li key={index} className={styles.winnerItem}>
                    <span>{winner.name}</span>
                    <span>Número: {winner.number}</span>
                    <span>💰 {winner.amount} WDL</span>
                  </li>
                ))
              ) : (
                <p className={styles.noWinners}>¡Aún no hay ganadores! Sé el primero en ganar el pozo 💰</p>
              )}
            </ul>
            <button className={styles.closeButton} onClick={onClose}>
          ❌ Cerrar
        </button>
          </div>
        </div>
      )}
    </>
  );
}
