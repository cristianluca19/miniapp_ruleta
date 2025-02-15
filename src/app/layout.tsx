"@/styles/globals.css";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import NextAuthProvider from "@/components/NextAuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
