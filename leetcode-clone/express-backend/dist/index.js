import express from "express";
import { createClient } from "redis";
const app = express();
app.use(express.json());
const client = createClient({});
app.post("/submit", async (req, res) => {
    const { problemId, userId, code, language } = req.body;
    // store the solution in redis list
    await client.lPush("submission", JSON.stringify({ problemId, userId, code, language }));
    res.status(200).send({ message: "Your submission is in the queue" });
});
// first lets connect redis client
async function startServer() {
    try {
        await client.connect();
        console.log("Redis client connected");
        app.listen(3000, () => {
            console.log("Server started at port 3000");
        });
    }
    catch (error) {
        console.log(`Error in starting server ${error}`);
    }
}
startServer();
//# sourceMappingURL=index.js.map