import { useState, useEffect } from "react";
import { ethers } from "ethers";
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

  // Check rate limit
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
      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const faucet = new ethers.Contract(
        "0x2cF83E27ff8AEfBb9e58aE328c5217fAf68a4BAE", // Faucet address
        ["function requestTokens() external"],
        signer
      );

      const tx = await faucet.requestTokens();
      console.log("tx:", tx.hash);
      setTxHash(tx.hash);
      setTxStatus("pending");

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setTxStatus("success");

        const lastRequestKey = `faucet_last_request_${address.toLowerCase()}`;
        localStorage.setItem(lastRequestKey, new Date().toISOString());
        setNextAvailableTime(
          new Date(Date.now() + RATE_LIMIT_HOURS * 60 * 60 * 1000)
        );
      } else {
        throw new Error("Transaction reverted");
      }

    } catch (err: any) {
      console.error("Error requesting tokens:", err);
      setErrorMessage(err.message || "Failed to request tokens");
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
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Eth2Aztec Bridge
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
          {/* Faucet Section */}
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

          {/* Bridge Section */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden shadow-2xl border bg-white dark:bg-gray-950">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-3 text-white">
                <h3 className="font-semibold text-center">Human.tech x Aztec Bridge</h3>
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
