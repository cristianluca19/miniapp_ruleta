// HomePage.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { MiniKit, VerifyCommandInput, VerificationLevel } from '@worldcoin/minikit-js';
import styles from './HomePage.module.css'; 

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleLogin = async () => {

    const verifyPayload: VerifyCommandInput = {
      action: 'login-action', // Reemplaza con tu ID de acción del Developer Portal
      verification_level: VerificationLevel.Orb,
    };

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

      if (finalPayload.status === 'success') {
        // Enviar el proof al backend para verificación
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payload: finalPayload,
            action: 'login-action',
          }),
        });

        if (response.ok) {
          // Redirigir a la página del juego tras la verificación exitosa
          router.push('/game');
        } else {
          console.error('Error en la verificación del backend');
          alert('Error en la verificación con el servidor. Inténtalo nuevamente.');
        }
      } else {
        console.error('Error en la verificación:', finalPayload);
        alert('Verificación fallida. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error durante el proceso de verificación:', error);
      alert('Hubo un problema con la verificación. Verifica tu conexión e intenta de nuevo.');
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.loginButton} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default HomePage;
