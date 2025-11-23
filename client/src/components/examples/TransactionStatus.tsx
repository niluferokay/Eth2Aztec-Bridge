import { useState } from "react";
import TransactionStatus from "../TransactionStatus";
import { Button } from "@/components/ui/button";

export default function TransactionStatusExample() {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => setStatus("pending")} size="sm">Show Pending</Button>
        <Button onClick={() => setStatus("success")} size="sm">Show Success</Button>
        <Button onClick={() => setStatus("error")} size="sm">Show Error</Button>
        <Button onClick={() => setStatus("idle")} size="sm" variant="outline">Clear</Button>
      </div>

      <TransactionStatus
        status={status}
        txHash="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        errorMessage="Insufficient funds for gas"
        explorerUrl="https://sepolia.etherscan.io"
        onDismiss={() => setStatus("idle")}
      />
    </div>
  );
}
