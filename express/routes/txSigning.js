import express from "express";
import { decryptPrivateKey } from "../controllers/signingController.js";
const router = express.Router();

router.post('/privateKey', decryptPrivateKey)


export default router;