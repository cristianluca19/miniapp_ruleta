"use client";
import { MiniKit, VerificationLevel, ISuccessResult } from "@worldcoin/minikit-js";
import { useCallback, useState } from "react";

export const VerifyBlock = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleVerify = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      setStatus("Error: MiniKit no está instalado");
      return;
    }

    const { finalPayload } = await MiniKit.commandsAsync.verify({
      action: "participate",
      verification_level: VerificationLevel.Device,
    });

    if (finalPayload.status === "error") {
      setStatus("Error en la verificación");
      return;
    }

    setStatus("Verificación exitosa");
  }, []);

  return (
    <div>
      <button onClick={handleVerify}>Verificar con Worldcoin</button>
      {status && <p>{status}</p>}
    </div>
  );
};
