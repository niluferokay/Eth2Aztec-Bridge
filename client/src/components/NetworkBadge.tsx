import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";

interface NetworkBadgeProps {
  chainId?: number;
  expectedChainId: number;
  networkName: string;
}

export default function NetworkBadge({ chainId, expectedChainId, networkName }: NetworkBadgeProps) {
  const isCorrectNetwork = chainId === expectedChainId;
  const isConnected = chainId !== undefined;

  if (!isConnected) {
    return (
      <Badge variant="secondary" className="gap-2" data-testid="badge-network-disconnected">
        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
        Not Connected
      </Badge>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <Badge variant="destructive" className="gap-2" data-testid="badge-network-wrong">
        <AlertCircle className="h-3 w-3" />
        Wrong Network
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="gap-2 bg-green-600 hover:bg-green-700" data-testid="badge-network-correct">
      <CheckCircle className="h-3 w-3" />
      {networkName}
    </Badge>
  );
}
