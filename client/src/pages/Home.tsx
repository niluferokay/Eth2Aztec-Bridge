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
      // For now, this is a mock transaction for UI demonstration
      // The transaction hash below is randomly generated and won't exist on Etherscan
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      const mockTxHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
      setTxHash(mockTxHash);
      setTxStatus("success");
      
      console.log("Mock transaction hash:", mockTxHash);
      console.log("Explorer link:", `${EXPLORER_URL}/tx/${mockTxHash}`);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <header className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">tU</span>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Testnet USDC Faucet
            </h2>
          </div>
          <div className="flex items-center gap-2">
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

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Faucet Section - Sidebar */}
          <div className="lg:col-span-1 space-y-4">
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

          {/* Main Content - Bridge Iframe */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden shadow-2xl border bg-white dark:bg-gray-950">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-3 text-white">
                <h3 className="font-semibold text-center">Human Protocol Bridge</h3>
              </div>
              <iframe
                src="https://bridge.human.tech/"
                width="100%"
                height="800px"
                className="border-0"
                title="Human Protocol Bridge"
                data-testid="iframe-bridge"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
