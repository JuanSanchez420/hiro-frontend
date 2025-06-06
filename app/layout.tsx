import type { Metadata } from "next";
import "./globals.css";
import { Disclosure } from '@headlessui/react'
import PromptInput from './components/PromptInput'
import Providers from "./providers";
import ConnectWallet from "./components/WalletMenu/ConnectWalletMenu";
import DrawerButton from "./components/DrawerButton";
import DrawerLeft from "./components/DrawerLeft";
import Link from "next/link";
import NewChat from "./components/NewChat";
import DrawerRight from "./components/DrawerRight";
import RainingIcons from "./components/RainingIcons";
import { GlobalContextProvider } from "./context/GlobalContext";
import { PromptsProvider } from "./context/PromptsContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import ThemeProvider from "./components/ThemeProvider";
import PortfolioButton from "./components/PortfolioButton";

export const metadata: Metadata = {
  title: "Hiro",
  description: "You need a Hiro! An AI agent for simplifying crypto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Providers>
      <PromptsProvider>
        <GlobalContextProvider>
          <PortfolioProvider>
          <html lang="en" className="h-full">
            <ThemeProvider>
              <div className="flex flex-col min-h-full h-full">
                <Disclosure as="nav">
                  <div className="mx-auto w-full px-4">
                    <div className="flex h-16 justify-between">
                      <div className="flex items-center">
                        <DrawerButton />
                        <div className="pl-5 text-2xl"><Link href="/">HIRO</Link></div>
                      </div>
                      <div className="ml-6 flex items-center">
                        <PortfolioButton />
                        <NewChat />
                        <ConnectWallet />
                      </div>
                    </div>
                  </div>
                </Disclosure>

                <div className="flex flex-col flex-1 h-full min-h-0 relative">
                  <main className="flex flex-col flex-1 overflow-y-auto">
                    <div className="flex flex-col mx-auto w-full h-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                      {children}
                      <DrawerLeft />
                      <DrawerRight />
                    </div>
                  </main>
                  <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8"><PromptInput /></div>
                </div>
              </div>
              <RainingIcons />
            </ThemeProvider>
          </html>
          </PortfolioProvider>
        </GlobalContextProvider>
      </PromptsProvider>
    </Providers>
  );
}
