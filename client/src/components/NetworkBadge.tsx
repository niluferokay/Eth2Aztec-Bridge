import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Circle } from "lucide-react";

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
        <Circle className="h-2 w-2 fill-muted-foreground" />
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
    <Badge className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0" data-testid="badge-network-correct">
      <CheckCircle className="h-3 w-3" />
      {networkName}
    </Badge>
  );
}
