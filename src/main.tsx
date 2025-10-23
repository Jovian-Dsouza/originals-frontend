import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <PrivyProvider
    appId={import.meta.env.VITE_PRIVY_APP_ID}
    config={{
      loginMethods: ['wallet', 'email'],
      appearance: {
        theme: 'dark',
        accentColor: '#676FFF',
        logo: '/logo.jpg',
      },
      embeddedWallets: {
        ethereum: {
          createOnLogin: 'off',
        },
      },
      defaultChain: {
        id: 8453, // Base mainnet
        name: 'Base',
        network: 'base',
        nativeCurrency: {
          decimals: 18,
          name: 'Ethereum',
          symbol: 'ETH',
        },
        rpcUrls: {
          default: {
            http: ['https://mainnet.base.org'],
          },
          public: {
            http: ['https://mainnet.base.org'],
          },
        },
        blockExplorers: {
          default: {
            name: 'BaseScan',
            url: 'https://basescan.org',
          },
        },
      },
    }}
  >
    <App />
  </PrivyProvider>
);
