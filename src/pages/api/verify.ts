// pages/api/verify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { payload, action, signal } = req.body as IRequestPayload;
    const app_id = process.env.APP_ID as `app_${string}`; // Asegúrate de definir APP_ID en tus variables de entorno

    try {
      const verifyRes: IVerifyResponse = await verifyCloudProof(payload, app_id, action, signal);

      if (verifyRes.success) {
        // Verificación exitosa
        res.status(200).json({ message: 'Verificación exitosa' });
      } else {
        // Error en la verificación
        res.status(400).json({ message: 'Error en la verificación', details: verifyRes });
      }
    } catch (error) {
      console.error('Error al verificar el proof:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
