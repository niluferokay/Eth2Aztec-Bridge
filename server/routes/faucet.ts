import { Router } from "express";
import { ethers } from "ethers";

const router = Router();

const FAUCET_ADDRESS = "0x2cF83E27ff8AEfBb9e58aE328c5217fAf68a4BAE";
const FAUCET_ABI = [
  "function requestTokens() external"
];

router.post("/", async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: "Missing address" });

    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, wallet);

    const tx = await faucet.requestTokens();
    await tx.wait();

    return res.json({ success: true, txHash: tx.hash });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
