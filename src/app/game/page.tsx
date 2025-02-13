"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import PlayButton from "@/components/PlayButton";
import Jackpot from "@/components/Jackpot";
import WinnersModal from "@/components/WinnersModal";

export default function GamePage() {
  const { data: session } = useSession();
  const [number, setNumber] = useState<number | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!session) {
    return <p>Debes iniciar sesión para jugar.</p>;
  }

  return (
    <div className="game-container">
      <h1 className="neon-title">Retro Ruleta 80s 🎰</h1>
      <Jackpot />
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(Number(e.target.value))}
        placeholder="Elige un número (0-99)"
        className="number-input"
      />
      <PlayButton number={number} />
      <button className="stats-button" onClick={() => setIsModalOpen(true)}>
        📊 Estadísticas
      </button>
      <WinnersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <button onClick={() => signOut()} className="logout-button">
        Cerrar sesión
      </button>
    </div>
  );
}
