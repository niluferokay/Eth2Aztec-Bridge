import { useState } from "react";
import WalletButton from "../WalletButton";

export default function WalletButtonExample() {
  const [address, setAddress] = useState<string>();

  return (
    <div className="p-8">
      <WalletButton
        address={address}
        onConnect={(addr) => {
          console.log("Connected:", addr);
          setAddress(addr);
        }}
        onDisconnect={() => {
          console.log("Disconnected");
          setAddress(undefined);
        }}
      />
    </div>
  );
}
