import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Droplet, CheckCircle, Sparkles } from "lucide-react";

interface FaucetCardProps {
  walletAddress?: string;
  isCorrectNetwork: boolean;
  isRateLimited: boolean;
  onRequestTokens: (address: string) => void;
  isLoading: boolean;
}

export default function FaucetCard({
  walletAddress,
  isCorrectNetwork,
  isRateLimited,
  onRequestTokens,
  isLoading,
}: FaucetCardProps) {
  const [inputAddress, setInputAddress] = useState("");

  const targetAddress = walletAddress || inputAddress;
  const isValidAddress = targetAddress && targetAddress.startsWith("0x") && targetAddress.length === 42;
  const canRequest = isValidAddress && isCorrectNetwork && !isRateLimited && !isLoading;

  const handleRequest = () => {
    if (canRequest) {
      onRequestTokens(targetAddress);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border-2 border-purple-200 dark:border-purple-800" data-testid="card-faucet">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 shadow-lg">
          <Droplet className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Get Testnet USDC
        </h2>
        <Badge variant="secondary" className="text-xs px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-purple-200 dark:border-purple-700">
          <Sparkles className="h-3 w-3 mr-1" />
          1000 tUSDC per request
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-semibold">
            Wallet Address
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="0x... or connect wallet"
            value={walletAddress || inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            disabled={!!walletAddress}
            className="font-mono text-sm"
            data-testid="input-address"
          />
          {isValidAddress && (
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              Valid address
            </div>
          )}
        </div>

        <Button
          onClick={handleRequest}
          disabled={!canRequest}
          className="w-full py-5 text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
          size="lg"
          data-testid="button-request-tokens"
        >
          {isLoading ? (
            "Processing..."
          ) : isRateLimited ? (
            "Rate Limited"
          ) : !isCorrectNetwork ? (
            "Wrong Network"
          ) : !isValidAddress ? (
            "Enter Valid Address"
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Request 1000 tUSDC
            </>
          )}
        </Button>

        {!isCorrectNetwork && walletAddress && (
          <p className="text-xs text-destructive text-center">
            Please switch to Sepolia testnet
          </p>
        )}
      </div>
    </Card>
  );
}
