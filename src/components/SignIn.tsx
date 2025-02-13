"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@worldcoin/miniapps-ui-kit-react";

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

  return <Button  onClick={() => signIn("worldcoin")}>Login</Button>;
};
