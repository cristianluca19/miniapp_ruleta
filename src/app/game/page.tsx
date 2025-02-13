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

  const winnersData = [
    { name: "Marty McFly", number: 42, amount: 10 },
    { name: "Doc Brown", number: 88, amount: 20 }
  ];

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
      {isModalOpen && <WinnersModal onClose={() => setIsModalOpen(false)} winners={winnersData} />}
      <button onClick={() => signOut()} className="logout-button">
        Cerrar sesión
      </button>
    </div>
  );
}
