"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useEffect, useState } from "react";
import { stringify } from "querystring";

export default function HomePage() { 
  const { data, status } = useSession(); 
  const router = useRouter();
  const [readData, setReadData] = useState(false)


  useEffect(() => {
    if (status === "authenticated") { 
      // router.push("/game"); 
      setReadData(true)
    } 
  }, [status, router]);

  return (
    <div className="login-container">
      <h1 className="neon-title">⚡ Retro Ruleta 80s ⚡</h1>
      {status === "loading" ? (
        <div className="spinner"></div>
      ) : (
        <Button variant="primary" size="lg" onClick={() => signIn("worldcoin")}>
          Login 0.3
        </Button>
      )}
      {readData && 
      <div>{JSON.stringify(data)}</div>
      }
    </div>
  );
}
