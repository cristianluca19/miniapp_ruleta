// pages/api/verify.ts
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js';
import { NextRequest, NextResponse } from 'next/server';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

export async function POST(req: NextRequest) {
	const { payload, action, signal } = (await req.json()) as IRequestPayload
	const app_id = 'app_8552501b4d2cd6b80c8045bfb0886096'; 
	const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse // Wrapper on this

	if (verifyRes.success) {
		// This is where you should perform backend actions if the verification succeeds
		// Such as, setting a user as "verified" in a database
		return NextResponse.json({ verifyRes, status: 200 })
	} else {
		// This is where you should handle errors from the World ID /verify endpoint.
		// Usually these errors are due to a user having already verified.
		return NextResponse.json({ verifyRes, status: 400 })
	}
}
