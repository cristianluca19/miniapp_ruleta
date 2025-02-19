// lib/blockchain.ts
import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

// ABI mínimo para ERC20: transfer y balanceOf
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

// Obtener variables de entorno y forzar tipos

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
if (!rpcUrl) throw new Error("NEXT_PUBLIC_RPC_URL not defined")

const devPrivateKeyRaw = process.env.DEV_PRIVATE_KEY
if (!devPrivateKeyRaw) throw new Error("DEV_PRIVATE_KEY not defined")
// Asegurarse de que la clave privada comience con "0x"
const devPrivateKey = (devPrivateKeyRaw.startsWith("0x") ? devPrivateKeyRaw : `0x${devPrivateKeyRaw}`) as `0x${string}`

const tokenAddressRaw = process.env.NEXT_PUBLIC_WDL_TOKEN_ADDRESS
if (!tokenAddressRaw) throw new Error("NEXT_PUBLIC_WDL_TOKEN_ADDRESS not defined")
const tokenAddress = tokenAddressRaw as `0x${string}`

const developerAddressRaw = process.env.DEV_ACCOUNT_ADDRESS
if (!developerAddressRaw) throw new Error("DEV_ACCOUNT_ADDRESS not defined")
const developerAddress = developerAddressRaw as `0x${string}`

// Crear el wallet client (para firmar transacciones) usando la POT WALLET
const account = privateKeyToAccount(devPrivateKey)
const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(rpcUrl),
})

// Crear un public client para operaciones de lectura
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(rpcUrl),
})

/**
 * Función auxiliar para esperar la confirmación de una transacción.
 * Realiza polling cada 1 segundo y calcula las confirmaciones a partir del bloque actual.
 */
async function customWaitForTransaction({
  hash,
  confirmations,
  timeout,
  client,
}: {
  hash: `0x${string}`,
  confirmations: number,
  timeout: number,
  client: ReturnType<typeof createPublicClient>,
}) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const receipt = await client.getTransactionReceipt({ hash })
    if (receipt) {
      const currentBlock = await client.getBlockNumber()
      // Forzamos receipt.blockNumber a number
      const txConfirmations = currentBlock - BigInt(receipt.blockNumber) + 1n
      if (txConfirmations >= confirmations) {
        return receipt
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error("Timeout waiting for transaction confirmation")
}


/**
 * Obtiene el saldo del token en la POT WALLET.
 */
export async function getPotBalance(): Promise<bigint> {
  const balanceRaw = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [walletClient.account.address as `0x${string}`],
  })
  // Convertir el valor obtenido (asumido como string) a bigint
  return BigInt(balanceRaw as string)
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
  
  // Calcular montos en bigint
  const montoWinner = (balance * BigInt(90)) / BigInt(100)
  const montoDeveloper = (balance * BigInt(8)) / BigInt(100)
  
  // Transferir 90% al ganador
  const txWinner = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "transfer",
    args: [winner as `0x${string}`, montoWinner],
  })
  console.log("Transferencia al ganador enviada, hash:", txWinner)
  await customWaitForTransaction({
    hash: txWinner as `0x${string}`,
    confirmations: 1,
    timeout: 60000,
    client: publicClient,
  })
  console.log("Transferencia al ganador confirmada")
  
  // Transferir 8% a la cuenta del desarrollador
  const txDeveloper = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "transfer",
    args: [developerAddress, montoDeveloper],
  })
  console.log("Transferencia al desarrollador enviada, hash:", txDeveloper)
  await customWaitForTransaction({
    hash: txDeveloper as `0x${string}`,
    confirmations: 1,
    timeout: 60000,
    client: publicClient,
  })
  console.log("Transferencia al desarrollador confirmada")
}
