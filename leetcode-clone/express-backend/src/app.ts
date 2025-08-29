import express from "express";
import cors from "cors";
import codeRoutes from "./routes/codeRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", codeRoutes);

app.get("/health", (_req, res) => res.json({ status: "OK", ts: new Date().toISOString() }));

export default app;
