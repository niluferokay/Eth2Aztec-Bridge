import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface WalletButtonProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
  address?: string;
}

export default function WalletButton({ onConnect, onDisconnect, address }: WalletButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts[0]) {
          onConnect(accounts[0]);
        }
      } else {
        alert("Please install MetaMask to use this faucet");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          onDisconnect();
        } else {
          onConnect(accounts[0]);
        }
      });
    }
  }, [onConnect, onDisconnect]);

  if (address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2" data-testid="button-wallet-connected">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">
                {address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-mono text-sm">{truncateAddress(address)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDisconnect} data-testid="button-disconnect">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="gap-2"
      data-testid="button-connect-wallet"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
