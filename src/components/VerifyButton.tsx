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
