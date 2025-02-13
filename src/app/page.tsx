"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@worldcoin/miniapps-ui-kit-react";
import styles from "./globals.css";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/game");
  }

  return (
    <div className="login-container">
      <h1 className="neon-title">⚡ Retro Ruleta 80s ⚡</h1>
      <Button onClick={() => signIn()} variant="primary" size="large">
        Iniciar sesión con World ID
      </Button>
    </div>
  );
}
