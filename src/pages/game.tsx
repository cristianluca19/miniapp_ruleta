// pages/game.tsx
import React, { useEffect, useState } from 'react'
import { 
  BrowserProvider, 
  JsonRpcProvider, 
  parseUnits, 
  formatUnits, 
  Contract 
} from 'ethers'
import axios from 'axios'

// ABI mínimo para ERC20
const erc20Abi = [
  "function transfer(address to, uint amount) public returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
]

// Variables de entorno (asegúrate de definirlas en tu .env.local)
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_WDL_TOKEN_ADDRESS || ""
const POT_WALLET = process.env.NEXT_PUBLIC_POT_WALLET_ADDRESS || ""

/**
 * Función auxiliar para conectar el wallet usando el SDK de Worldcoin.
 * Se asume que el SDK de Worldcoin inyecta window.worldcoin; si no, se hace fallback a window.ethereum.
 */
async function connectWorldcoinWallet(): Promise<BrowserProvider> {
  if ((window as any).worldcoin) {
    return new BrowserProvider((window as any).worldcoin)
  } else if ((window as any).ethereum) {
    return new BrowserProvider((window as any).ethereum)
  } else {
    throw new Error("No se encontró un wallet compatible.")
  }
}

export default function GamePage() {
  const [userNumber, setUserNumber] = useState('')
  const [randomNumber, setRandomNumber] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [pot, setPot] = useState('0')
  const [animating, setAnimating] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  // Conecta el wallet usando BrowserProvider (ethers v6)
  // const connectWallet = async () => {
  //   try {
  //     const provider = await connectWorldcoinWallet()
  //     const signer = await provider.getSigner()  // Esperamos la promesa
  //     const address = await signer.getAddress()
  //     setUserAddress(address)
  //     console.log("Wallet conectado:", address)
  //   } catch (error) {
  //     console.error("Error conectando el wallet:", error)
  //   }
  // }

  // Función para que el usuario deposite 0.1 WDL a la POT WALLET
  // const depositTokens = async () => {
  //   if (!userAddress) {
  //     alert("Conecta tu wallet primero.")
  //     return false
  //   }
  //   try {
  //     const provider = await connectWorldcoinWallet()
  //     const signer = await provider.getSigner()  // Esperamos aquí también
  //     const tokenContract = new Contract(TOKEN_ADDRESS, erc20Abi, signer)
  //     // Se envían 0.1 WDL (asumiendo 18 decimales)
  //     const amount = parseUnits("0.1", 18)
  //     const tx = await tokenContract.transfer(POT_WALLET, amount)
  //     await tx.wait()
  //     console.log("Depósito completado:", tx.hash)
  //     return true
  //   } catch (error) {
  //     console.error("Error en el depósito:", error)
  //     return false
  //   }
  // }

  // Función para actualizar el saldo del pozo utilizando un JsonRpcProvider
  const updatePotBalance = async () => {
    try {
      // const jsonProvider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
      // const tokenContract = new Contract(TOKEN_ADDRESS, erc20Abi, jsonProvider)
      // const balance = await tokenContract.balanceOf(POT_WALLET)
      setPot(pot+1)
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

    // Primero, el usuario debe depositar 0.1 WDL
    // const depositOk = await depositTokens()
    // if (!depositOk) {
    //   alert("El depósito falló. Verifica tu wallet y vuelve a intentarlo.")
    //   return
    // }

    // await updatePotBalance()

    // Iniciar animación de números aleatorios durante 2500 ms
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
          // if (!userAddress) {
          //   alert("No se pudo determinar tu dirección de wallet.")
          //   return
          // }
          // Llamar a la API de payout, pasando la dirección del ganador
          // axios.post('/api/payout', { winner: userAddress })
          //   .then((res) => {
          //     console.log("Payout ejecutado:", res.data)
          //     updatePotBalance()
          //   })
          //   .catch((err) => {
          //     console.error("Error en el payout:", err)
          //   })
        } else {
          setMessage("No acertaste, ¡intenta de nuevo!")
          // updatePotBalance()
        }
      }
    }, interval)
  }

  // useEffect(() => {
  //   connectWallet()
  //   updatePotBalance()
  // }, [])

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
          Jugar 0.06
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
