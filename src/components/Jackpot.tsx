"use client";
import { useEffect, useState } from "react";

export default function Jackpot() {
  const [jackpot, setJackpot] = useState(0);

  useEffect(() => {
    const fetchJackpot = async () => {
      const res = await fetch("/api/jackpot");
      const data = await res.json();
      setJackpot(data.jackpot);
    };

    fetchJackpot();
    const interval = setInterval(fetchJackpot, 5000);
    return () => clearInterval(interval);
  }, []);

  return <h2 className="jackpot">💰 Pozo: {jackpot} WDL</h2>;
}
