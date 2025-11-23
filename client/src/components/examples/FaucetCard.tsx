import { useState } from "react";
import FaucetCard from "../FaucetCard";

export default function FaucetCardExample() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <FaucetCard
        walletAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
        isCorrectNetwork={true}
        isRateLimited={false}
        isLoading={isLoading}
        onRequestTokens={(address) => {
          console.log("Requesting tokens for:", address);
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 2000);
        }}
      />
    </div>
  );
}
