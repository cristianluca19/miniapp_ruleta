"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/game");
  }

  return (
    <div className="login-container">
      <h1 className="neon-title">⚡ Retro Ruleta 80s ⚡</h1>
     <Button variant="primary" size="lg"  onClick={() => signIn("worldcoin")}>Login 0.2</Button>;
    </div>
  );
}
