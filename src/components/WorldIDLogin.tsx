
// components/WorldIDLogin.tsx
import styles from '.HomePage/HomePage.module.css'; 
import { useRouter } from 'next/router'
import { IDKitWidget } from '@worldcoin/idkit'
import React from 'react'

export default function WorldIDLogin() {
  const router = useRouter()

  const handleSuccess = (result: any) => {
    console.log('Verificación exitosa:', result)
    // Aquí podrías crear una sesión usando next-auth o tu lógica propia.
    router.push('/game')
  }

  const handleError = (error: any) => {
    console.error('Error en la verificación:', error)
  }

  return (
    <div
      style={{
        background: "url('/assets/retro_background.jpg') center center / cover no-repeat",
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IDKitWidget
        action={process.env.NEXT_PUBLIC_WORLDCOIN_ACTION_ID || 'login-action'}
        app_id="app_8552501b4d2cd6b80c8045bfb0886096"
        onSuccess={handleSuccess}
        onError={handleError}
      >
        {({ open }) => (
          <button
            onClick={open}
            className={styles.loginButton}
          >
            Login 0.8
          </button>
        )}
      </IDKitWidget>
    </div>
  )
}
