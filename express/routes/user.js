import express from "express";
import { register, userLogin, getAllUsers } from "../controllers/userController.js";
import { verifyAuthToken } from "../middleware/verifyAuthToken.js";
const router = express.Router();

router.get("/all", verifyAuthToken, getAllUsers);
router.post("/register", register);
router.post("/login", userLogin)


export default router;