// pages/game.tsx
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

// ABI mínimo de ERC20 para transfer y balanceOf
const erc20Abi = [
  "function transfer(address to, uint amount) public returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
]

// Variables de entorno
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_WDL_TOKEN_ADDRESS || ""
const POT_WALLET = process.env.NEXT_PUBLIC_POT_WALLET_ADDRESS || ""

/**
 * Función auxiliar para conectar el wallet usando el SDK de Worldcoin.
 * Se asume que el SDK de Worldcoin expone un objeto o función global (window.worldcoin)
 * que permite conectar y obtener un provider compatible con ethers.
 * Si no está disponible, se puede hacer fallback a window.ethereum.
 */
async function connectWorldcoinWallet(): Promise<ethers.providers.Web3Provider> {
  if ((window as any).worldcoin) {
    // Suponemos que worldcoin ya está inyectado y es compatible
    return new ethers.providers.Web3Provider((window as any).worldcoin)
  } else if (window.ethereum) {
    // Fallback a MetaMask en caso de que no esté disponible Worldcoin
    return new ethers.providers.Web3Provider(window.ethereum)
  } else {
    throw new Error("No se encontró un wallet compatible con Worldcoin o MetaMask.")
  }
}

export default function GamePage() {
  const [userNumber, setUserNumber] = useState('')
  const [randomNumber, setRandomNumber] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [pot, setPot] = useState('0')
  const [animating, setAnimating] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  // Conectar el wallet usando el SDK de Worldcoin
  const connectWallet = async () => {
    try {
      const provider = await connectWorldcoinWallet()
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      setUserAddress(address)
      console.log("Wallet conectado:", address)
    } catch (error) {
      console.error("Error conectando el wallet de Worldcoin:", error)
    }
  }

  // Función para que el usuario deposite 0.1 WDL a la POT WALLET usando el SDK de Worldcoin
  const depositTokens = async () => {
    if (!userAddress) {
      alert("Conecta tu wallet primero.")
      return false
    }
    try {
      // Conectar al provider del wallet a través del SDK de Worldcoin
      const provider = await connectWorldcoinWallet()
      const signer = provider.getSigner()
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, signer)
      
      // Se envían 0.1 WDL (asumiendo 18 decimales)
      const amount = ethers.utils.parseUnits("0.1", 18)
      const tx = await tokenContract.transfer(POT_WALLET, amount)
      await tx.wait()
      console.log("Depósito completado:", tx.hash)
      return true
    } catch (error) {
      console.error("Error en el depósito:", error)
      return false
    }
  }

  // Función para actualizar el saldo del pozo consultando la blockchain
  const updatePotBalance = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, provider)
      const balance = await tokenContract.balanceOf(POT_WALLET)
      setPot(ethers.utils.formatUnits(balance, 18))
    } catch (error) {
      console.error("Error al obtener el balance del pozo:", error)
    }
  }

  // Lógica principal al pulsar "Jugar"
  const handlePlay = async () => {
    const num = parseInt(userNumber)
    if (isNaN(num) || num < 0 || num > 99) {
      alert('Por favor ingresa un número entre 0 y 99')
      return
    }

    // Primero, el usuario debe depositar 0.1 WDL usando el wallet de Worldcoin
    const depositOk = await depositTokens()
    if (!depositOk) {
      alert("El depósito falló. Verifica tu wallet y vuelve a intentarlo.")
      return
    }

    // Actualizar el pozo luego del depósito
    await updatePotBalance()

    // Iniciar la animación de números aleatorios durante 2500 ms
    setAnimating(true)
    let elapsed = 0
    const interval = 50
    const animationInterval = setInterval(() => {
      const newRandom = Math.floor(Math.random() * 100)
      setRandomNumber(newRandom)
      elapsed += interval
      if (elapsed >= 2500) {
        clearInterval(animationInterval)
        setAnimating(false)
        if (newRandom === num) {
          setMessage("¡Ganaste el pozo!")
          // Llamar a la API de payout, pasando la dirección del ganador
          if (!userAddress) {
            alert("No se pudo determinar tu dirección de wallet.")
            return
          }
          axios.post('/api/payout', { winner: userAddress })
            .then((res) => {
              console.log("Payout ejecutado:", res.data)
              // Actualizamos el balance del pozo luego del payout
              updatePotBalance()
            })
            .catch((err) => {
              console.error("Error en el payout:", err)
            })
        } else {
          setMessage("No acertaste, ¡intenta de nuevo!")
          // Actualizar el pozo (si hubo depósito, se acumuló)
          updatePotBalance()
        }
      }
    }, interval)
  }

  useEffect(() => {
    connectWallet()
    updatePotBalance()
  }, [])

  return (
    <div
      style={{
        background: 'black',
        color: 'white',
        fontFamily: '"Press Start 2P", cursive',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#ff00ff' }}>
        Pozo: {pot} WDL
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <input
          type="number"
          value={userNumber}
          onChange={(e) => setUserNumber(e.target.value)}
          placeholder="Ingresa un número (0-99)"
          style={{ padding: '10px', fontSize: '20px', textAlign: 'center', width: '200px', marginBottom: '20px' }}
        />
        <button
          onClick={handlePlay}
          disabled={animating}
          style={{
            padding: '15px 30px',
            fontSize: '20px',
            background: '#00ffff',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 0 10px #00ffff'
          }}
        >
          Jugar
        </button>
        <div style={{ marginTop: '30px', fontSize: '30px', minHeight: '50px' }}>
          {animating ? <span>Animando: {randomNumber}</span> : randomNumber !== null && <span>{randomNumber}</span>}
        </div>
        <div style={{ marginTop: '20px', fontSize: '24px', color: '#ff00ff' }}>
          {message}
        </div>
      </div>
    </div>
  )
}
