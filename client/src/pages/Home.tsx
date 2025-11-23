import { useState, useEffect } from "react";
import WalletButton from "@/components/WalletButton";
import NetworkBadge from "@/components/NetworkBadge";
import FaucetCard from "@/components/FaucetCard";
import TransactionStatus from "@/components/TransactionStatus";
import RateLimitDisplay from "@/components/RateLimitDisplay";
import ThemeToggle from "@/components/ThemeToggle";

// Configuration
const EXPECTED_CHAIN_ID = 11155111; // Sepolia
const NETWORK_NAME = "Sepolia Testnet";
const EXPLORER_URL = "https://sepolia.etherscan.io";
const RATE_LIMIT_HOURS = 24;

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>();
  const [chainId, setChainId] = useState<number>();
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [nextAvailableTime, setNextAvailableTime] = useState<Date>();

  // Check if wallet is already connected
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts[0]) {
            setWalletAddress(accounts[0]);
          }
        });

      window.ethereum
        .request({ method: "eth_chainId" })
        .then((chainIdHex: string) => {
          setChainId(parseInt(chainIdHex, 16));
        });

      window.ethereum.on("chainChanged", (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
      });
    }
  }, []);

  // Check rate limit for address
  useEffect(() => {
    if (walletAddress) {
      const lastRequestKey = `faucet_last_request_${walletAddress.toLowerCase()}`;
      const lastRequest = localStorage.getItem(lastRequestKey);
      
      if (lastRequest) {
        const lastRequestTime = new Date(lastRequest);
        const nextTime = new Date(lastRequestTime.getTime() + RATE_LIMIT_HOURS * 60 * 60 * 1000);
        
        if (nextTime > new Date()) {
          setNextAvailableTime(nextTime);
        } else {
          setNextAvailableTime(undefined);
        }
      }
    }
  }, [walletAddress]);

  const handleConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(undefined);
    setChainId(undefined);
    setNextAvailableTime(undefined);
  };

  const handleRequestTokens = async (address: string) => {
    console.log("Requesting tokens for:", address);
    setTxStatus("pending");
    setTxHash(undefined);
    setErrorMessage(undefined);

    try {
      // TODO: Replace with actual contract interaction
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      const mockTxHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
      setTxHash(mockTxHash);
      setTxStatus("success");

      // Set rate limit
      const lastRequestKey = `faucet_last_request_${address.toLowerCase()}`;
      localStorage.setItem(lastRequestKey, new Date().toISOString());
      setNextAvailableTime(new Date(Date.now() + RATE_LIMIT_HOURS * 60 * 60 * 1000));

    } catch (error: any) {
      console.error("Error requesting tokens:", error);
      setErrorMessage(error.message || "Failed to request tokens");
      setTxStatus("error");
    }
  };

  const isRateLimited = nextAvailableTime ? nextAvailableTime > new Date() : false;
  const isCorrectNetwork = chainId === EXPECTED_CHAIN_ID;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">tUSDC Faucet</h2>
          </div>
          <div className="flex items-center gap-3">
            <NetworkBadge
              chainId={chainId}
              expectedChainId={EXPECTED_CHAIN_ID}
              networkName={NETWORK_NAME}
            />
            <WalletButton
              address={walletAddress}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <FaucetCard
            walletAddress={walletAddress}
            isCorrectNetwork={isCorrectNetwork}
            isRateLimited={isRateLimited}
            onRequestTokens={handleRequestTokens}
            isLoading={txStatus === "pending"}
          />

          {isRateLimited && <RateLimitDisplay nextAvailableTime={nextAvailableTime} />}

          <TransactionStatus
            status={txStatus}
            txHash={txHash}
            errorMessage={errorMessage}
            explorerUrl={EXPLORER_URL}
            onDismiss={() => setTxStatus("idle")}
          />
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Testnet USDC Faucet • Get 1000 tUSDC every 24 hours</p>
          <p className="mt-2">
            For development and testing purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}
