// pages/api/transaction.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { transferTokens } from '../../lib/blockchain'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  
  try {
    // Ejecuta la transacción de 0.1 WDL
    await transferTokens(0.1)
    res.status(200).json({ success: true })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}
