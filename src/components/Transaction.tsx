"use client";
import { useCallback } from "react";

export default function Transaction(){
  const handleTransaction = useCallback(async () => {
    const res = await fetch("/api/transaction", { method: "POST" });
    const data = await res.json();
    console.log("Transacción realizada:", data);
  }, []);

  return <button onClick={handleTransaction}>Participar</button>;
};
