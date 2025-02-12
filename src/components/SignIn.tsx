"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>Bienvenido, {session.user?.name}</p>
        <button onClick={() => signOut()}>Cerrar sesión</button>
      </>
    );
  }

  return <button onClick={() => signIn("worldcoin")}>Login</button>;
};
