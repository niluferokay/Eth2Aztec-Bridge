import NetworkBadge from "../NetworkBadge";

export default function NetworkBadgeExample() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <NetworkBadge expectedChainId={11155111} networkName="Sepolia Testnet" />
      <NetworkBadge chainId={11155111} expectedChainId={11155111} networkName="Sepolia Testnet" />
      <NetworkBadge chainId={1} expectedChainId={11155111} networkName="Sepolia Testnet" />
    </div>
  );
}
