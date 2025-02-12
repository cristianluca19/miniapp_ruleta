"use client";

import SignIn from "@/components/SignIn";
import VerifyBlock from "@/components/VerifyBlock";
import Transaction from "@/components/Transaction";
import VerifyButton from "@/components/VerifyButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Mini App de Worldcoin</h1>
      
      {/* Botón de Login */}
      <SignIn />

      {/* Botón de Verificación */}
      <VerifyBlock />

      {/* Botón de Transacción */}
      <Transaction />

      <VerifyButton />
    </div>
  );
}
