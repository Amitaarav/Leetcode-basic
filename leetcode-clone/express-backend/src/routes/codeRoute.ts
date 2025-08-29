import { Router } from "express";
import { runCode } from "../controllers/codeController.js";
import { validateCode } from "../middlewares/codeValidator.js";

const router = Router();

router.post("/run", validateCode, runCode);

export default router;
