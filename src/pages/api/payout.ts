// pages/api/payout.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { payoutDistribution } from '../../lib/blockchain'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { winner } = req.body
  if (!winner) {
    res.status(400).json({ error: 'Falta la dirección del ganador' })
    return
  }

  try {
    await payoutDistribution(winner)
    res.status(200).json({ success: true })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}
