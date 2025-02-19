// HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult, ResponseEvent, MiniAppVerifyActionPayload } from '@worldcoin/minikit-js';
import styles from './HomePage.module.css'; 

const verifyPayload: VerifyCommandInput = {
  action: 'login-action', // Asegúrate de que coincide con el Developer Portal
  verification_level: VerificationLevel.Orb, // Orb | Device
};

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false); // Estado para saber si la verificación fue exitosa

  useEffect(() => {
    const verifyUser = async () => {
      if (!MiniKit.isInstalled()) {
        console.error("MiniKit no está instalado. Asegúrate de abrir en World App.");
        return;
      }

      try {
        console.log("🛠 Iniciando verificación automática con MiniKit...");
        const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
        console.log("🔄 Respuesta de MiniKit:", finalPayload);

        if (finalPayload.status === 'error') {
          console.error("❌ Error en la verificación:", finalPayload);
          alert("Error en la verificación. Inténtalo nuevamente.");
          return;
        }

        // Verificar el proof en el backend
        const verifyResponse = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payload: finalPayload as ISuccessResult, // Solo los datos necesarios
            action: 'login-action',
          }),
        });

        const verifyResponseJson = await verifyResponse.json();
        console.log("🔄 Respuesta del backend:", verifyResponseJson);

        if (verifyResponse.ok) {
          console.log("✅ Usuario verificado exitosamente!");
          setIsVerified(true); // Habilitar el botón "Login"
        } else {
          console.error("❌ Error en la verificación del backend:", verifyResponseJson);
          alert("Error en la verificación. Inténtalo nuevamente.");
        }
      } catch (error) {
        console.error("❌ Error en la verificación:", error);
        alert("Hubo un problema con la verificación. Inténtalo nuevamente.");
      }
    };

    verifyUser();
  }, []);

  const handleLogin = () => {
    if (isVerified) {
      router.push('/game');
    } else {
      alert("Primero debes verificar tu identidad.");
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.loginButton} 
        onClick={handleLogin}
        disabled={!isVerified} // Deshabilita el botón si no está verificado
      >
        {isVerified ? "Login 1.2" : "Verificando..."}
      </button>
    </div>
  );
};

export default HomePage;
