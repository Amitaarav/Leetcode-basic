import { type Request, type Response } from "express";
import { executePython } from "../services/codeExecuteService.js";

export async function runCode(req: Request, res: Response) {
    try {
        const { code } = req.body;
        const result = await executePython(code);
        res.json({ ...result, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error("runCode error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}
