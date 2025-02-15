"@/styles/globals.css";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import NextAuthProvider from "@/components/NextAuthProvider";
import MiniKitProvider from "@/components/minikit-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <MiniKitProvider>
        <NextAuthProvider>
          <body>
            {children}
          </body>
        </NextAuthProvider>
      </MiniKitProvider>
    </html>
  );
}
