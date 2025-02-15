"@/styles/globals.css";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import NextAuthProvider from "@/components/NextAuthProvider";
import MiniKitProvider from "@/components/minikit-provider";
// import { ErudaProvider } from "@/components/Eruda";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* <ErudaProvider> */}
        <MiniKitProvider>
          <NextAuthProvider>
            <body>
              {children}
            </body>
          </NextAuthProvider>
        </MiniKitProvider>
      {/* </ErudaProvider> */}
    </html>
  );
}
