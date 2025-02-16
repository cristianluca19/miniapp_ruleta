// lib/blockchain.ts
import { createWalletClient, http, waitForTransaction } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { parseUnits } from 'viem'
import { getContract } from 'viem'
import { mainnet } from 'viem/chains'

const erc20Abi = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
]

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
if (!rpcUrl) throw new Error("NEXT_PUBLIC_RPC_URL no está definida")

// La POT WALLET se controla con DEV_PRIVATE_KEY
const devPrivateKey = process.env.DEV_PRIVATE_KEY
if (!devPrivateKey) throw new Error("DEV_PRIVATE_KEY no está definida")

const tokenAddress = process.env.NEXT_PUBLIC_WDL_TOKEN_ADDRESS
if (!tokenAddress) throw new Error("NEXT_PUBLIC_WDL_TOKEN_ADDRESS no está definida")

const developerAddress = process.env.DEV_ACCOUNT_ADDRESS
if (!developerAddress) throw new Error("DEV_ACCOUNT_ADDRESS no está definida")

// Crear cliente de wallet a partir de la POT WALLET
const account = privateKeyToAccount(devPrivateKey)
const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(rpcUrl)
})

// Función para obtener el saldo del token en la POT WALLET
export async function getPotBalance(): Promise<bigint> {
  const contract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    publicClient: walletClient
  })
  const balance: bigint = await contract.read.balanceOf([walletClient.account.address])
  return balance
}

/**
 * Distribuye el payout de la siguiente manera:
 * - 90% del saldo se transfiere al ganador.
 * - 8% se transfiere a la cuenta del desarrollador.
 * - El 2% permanece en la POT WALLET.
 */
export async function payoutDistribution(winner: string): Promise<void> {
  const balance = await getPotBalance()
  if (balance === BigInt(0)) {
    throw new Error("El pozo está vacío")
  }
  
  // Calcular montos (operaciones en bigint)
  const montoWinner = (balance * BigInt(90)) / BigInt(100)
  const montoDeveloper = (balance * BigInt(8)) / BigInt(100)
  // El 2% se queda en la POT WALLET
  
  const contract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    walletClient
  })
  
  // Transferir 90% al ganador
  const txWinner = await contract.write.transfer([winner, montoWinner])
  console.log("Transferencia al ganador enviada, hash:", txWinner)
  await waitForTransaction({ hash: txWinner, confirmations: 1, timeout: 60000, client: walletClient })
  console.log("Transferencia al ganador confirmada")
  
  // Transferir 8% a la cuenta del desarrollador
  const txDeveloper = await contract.write.transfer([developerAddress, montoDeveloper])
  console.log("Transferencia al desarrollador enviada, hash:", txDeveloper)
  await waitForTransaction({ hash: txDeveloper, confirmations: 1, timeout: 60000, client: walletClient })
  console.log("Transferencia al desarrollador confirmada")
}
