"use client";
import { Button } from "@worldcoin/miniapps-ui-kit";
import { useState } from "react";

export default function PlayButton({ number }: { number: number | "" }) {
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    if (number === "") {
      alert("Debes ingresar un número.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 0.1, number }),
      });

      const data = await response.json();
      if (data.success) {
        alert("🎲 Apuesta realizada, ¡buena suerte!");
      } else {
        alert("❌ Error en la transacción.");
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <Button onClick={handlePlay} variant="primary" disabled={loading}>
      {loading ? "Procesando..." : "Jugar"}
    </Button>
  );
}
