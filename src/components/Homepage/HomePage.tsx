// HomePage.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
import styles from './HomePage.module.css'; 

const verifyPayload: VerifyCommandInput = {
	action: 'login-action', // This is your action ID from the Developer Portal
	verification_level: VerificationLevel.Orb, // Orb | Device
}

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleLogin = async () => {
    
    // if (!MiniKit.isInstalled()) {
    //   return
    // }

    // const verifyPayload: VerifyCommandInput = {
    //   action: "login-action", // Reemplaza con tu ID de acción del Developer Portal
    //   verification_level: VerificationLevel.Orb,
    // };

    // try {
    //   const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

    //   if (finalPayload.status === 'success') {
    //     // Enviar el proof al backend para verificación
    //     const response = await fetch('/api/verify', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         payload: finalPayload,
    //         action: 'login-action',
    //       }),
    //     });

    //     if (response.ok) {
    //       // Redirigir a la página del juego tras la verificación exitosa
    //       router.push('/game');
    //     } else {
    //       console.error('Error en la verificación del backend');
    //       alert('Error en la verificación con el servidor. Inténtalo nuevamente.');
    //     }
    //   } else {
    //     console.error('Error en la verificación:', finalPayload);
    //     alert('Verificación fallida. Intenta nuevamente.');
    //   }
    // } catch (error) {
    //   console.error('Error durante el proceso de verificación:', error);
    //   alert('Hubo un problema con la verificación. Verifica tu conexión e intenta de nuevo.');
    // }
	if (!MiniKit.isInstalled()) {
		return
	}
	// World App will open a drawer prompting the user to confirm the operation, promise is resolved once user confirms or cancels
	const {finalPayload} = await MiniKit.commandsAsync.verify(verifyPayload)
		if (finalPayload.status === 'error') {
			return console.log('Error payload', finalPayload)
		}

		// Verify the proof in the backend
		const verifyResponse = await fetch('/api/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			payload: finalPayload as ISuccessResult, // Parses only the fields we need to verify
			action: 'login-action',
		}),
	})

	// TODO: Handle Success!
	const verifyResponseJson = await verifyResponse.json()
	if (verifyResponseJson.status === 200) {
		console.log('Verification success!')
    router.push('/game');
	}
}

  return (
    <div className={styles.container}>
      <button className={styles.loginButton} onClick={handleLogin}>
        Login 1.0
      </button>
    </div>
  );
};

export default HomePage;
