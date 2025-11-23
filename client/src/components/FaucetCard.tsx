import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Droplet, CheckCircle } from "lucide-react";

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
    <Card className="p-8 md:p-12" data-testid="card-faucet">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Droplet className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Get Testnet USDC</h1>
        <p className="text-muted-foreground mb-4">
          Request free tUSDC tokens for development and testing
        </p>
        <Badge variant="secondary" className="text-sm px-4 py-1">
          1000 tUSDC per request
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-base">
            Wallet Address
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="0x... or connect wallet"
            value={walletAddress || inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            disabled={!!walletAddress}
            className="font-mono"
            data-testid="input-address"
          />
          {isValidAddress && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Valid address
            </div>
          )}
        </div>

        <Button
          onClick={handleRequest}
          disabled={!canRequest}
          className="w-full py-6 text-lg font-semibold"
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
            "Request 1000 tUSDC"
          )}
        </Button>

        {!isCorrectNetwork && walletAddress && (
          <p className="text-sm text-destructive text-center">
            Please switch to Sepolia testnet to request tokens
          </p>
        )}
      </div>
    </Card>
  );
}
