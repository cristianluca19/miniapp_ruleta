"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";


export default function SignIn(){
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>Bienvenido, {session.user?.name}</p>
        <Button  onClick={() => signOut()}>Cerrar sesión</Button>
      </>
    );
  }

  return <Button variant="primary" size="lg"  onClick={() => signIn("worldcoin")}>Login 0.1</Button>;
};
