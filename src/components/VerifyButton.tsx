"use client";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useState } from "react";

export default function VerifyButton() {
  const [verified, setVerified] = useState(false);

  // Función que envía la prueba al backend para validación
  const verifyProof = async (proof: any) => {
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...proof,
          action: "verify-user", // Acción de verificación personalizada
        }),
      });

      if (response.ok) {
        setVerified(true);
        console.log("✅ Usuario verificado con éxito.");
      } else {
        console.error("❌ Error en la verificación.");
      }
    } catch (error) {
      console.error("🚨 Error en la verificación:", error);
    }
  };


  // function handler(req: NextApiRequest, res: NextApiResponse) {
  //   const proof = req.body
  //     const app_id = process.env.APP_ID
  //     const action = process.env.ACTION_ID
  //   const verifyRes = (await verifyCloudProof(proof, app_id, action)) as IVerifyResponse
  
  //     if (verifyRes.success) {
  //         // This is where you should perform backend actions if the verification succeeds
  //         // Such as, setting a user as "verified" in a database
  //         res.status(200).send(verifyRes);

  //     } else {
  //         // This is where you should handle errors from the World ID /verify endpoint. 
  //         // Usually these errors are due to a user having already verified.
  //         res.status(400).send(verifyRes);
          
  //     }
  // };

  return (
    <IDKitWidget
      app_id="app_8552501b4d2cd6b80c8045bfb0886096"
      action="verify-user"
      verification_level={VerificationLevel.Device}
      handleVerify={verifyProof}
      onSuccess={() => console.log("✅ Verificación exitosa")}
    >
      {({ open }) => (
        <button onClick={open} className="px-4 py-2 bg-blue-500 text-white rounded">
          {verified ? "✔ Verificado" : "Verificar con World ID"}
        </button>
      )}
    </IDKitWidget>
  );
}
