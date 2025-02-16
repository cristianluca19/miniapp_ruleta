// components/WorldIDLogin.tsx
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
        action={process.env.NEXT_PUBLIC_WORLDCOIN_ACTION_ID || 'default_action_id'}
        app_id={process.env.APP_ID}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        {({ open }) => (
          <button
            onClick={open}
            style={{
              padding: '20px 40px',
              fontSize: '24px',
              background: '#ff00ff',
              color: '#00ffff',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 0 20px rgba(0,255,255,0.7)',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        )}
      </IDKitWidget>
    </div>
  )
}
