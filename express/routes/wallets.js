import express from "express";
import { getWallets, getWallet, addWallet, deleteWallet, updateWallet } from "../controllers/walletDBController.js";
const router = express.Router();

// Make sure it is just a slash, not /api
router.get("/", getWallets);
router.get("/:id", getWallet);
router.post("/", addWallet);
router.put("/:id", updateWallet);
router.delete("/:id", deleteWallet);

export default router;