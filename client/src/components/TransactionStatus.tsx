import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TransactionStatusProps {
  status: "pending" | "success" | "error" | "idle";
  txHash?: string;
  errorMessage?: string;
  explorerUrl?: string;
  onDismiss?: () => void;
}

export default function TransactionStatus({
  status,
  txHash,
  errorMessage,
  explorerUrl,
  onDismiss,
}: TransactionStatusProps) {
  if (status === "idle") return null;

  const truncateTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <Card className="p-6 relative" data-testid="card-transaction-status">
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={onDismiss}
          data-testid="button-dismiss-status"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="flex items-start gap-4">
        {status === "pending" && (
          <>
            <Loader2 className="h-6 w-6 text-primary animate-spin flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Processing Transaction</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while your transaction is being processed...
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Transaction Successful!</h3>
              <p className="text-sm text-muted-foreground mb-3">
                1000 tUSDC has been sent to your wallet
              </p>
              {txHash && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {truncateTxHash(txHash)}
                  </Badge>
                  {explorerUrl && (
                    <a
                      href={`${explorerUrl}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      data-testid="link-explorer"
                    >
                      View on Explorer
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Transaction Failed</h3>
              <p className="text-sm text-muted-foreground">
                {errorMessage || "An error occurred while processing your request"}
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
