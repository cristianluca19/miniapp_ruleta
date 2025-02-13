import NextAuthProvider from "@/components/NextAuthProvider";
import styles from "@/styles/globals.module.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
