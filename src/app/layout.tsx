import type { Metadata } from "next";
import { IBM_Plex_Mono, Karla, Newsreader } from "next/font/google";
import { auth } from "@/auth";
import { Header } from "@/shared/components";
import { THEME_INIT_SCRIPT } from "@/shared/utils/theme";
import { CartDrawer } from "@/modules/cart/components/CartDrawer";
import { Providers } from "./providers";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const karla = Karla({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-sans",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  title: {
    default: "Nook",
    template: "%s · Nook",
  },
  description: "A quiet neighborhood cafe — menu, ordering, and a warm corner to sit in.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${karla.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Plain inline script (not next/script) so it runs before first
            paint — no next/script strategy guarantees that in the App
            Router. See src/shared/utils/theme.ts for what it does. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans">
        {/* userId is a server-derived prop, not client session state — see
            CartProvider/cartId.ts. Sign-in/out already does a full page
            reload (useAuthForm.ts), so there's no case where a client
            component needs this to change without a fresh render here. */}
        <Providers userId={userId}>
          <Header userId={userId} />
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
