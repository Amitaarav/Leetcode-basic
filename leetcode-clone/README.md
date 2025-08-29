# LeetCode Clone – Distributed Code Execution Platform

This project is a simplified **LeetCode-like platform** that allows users to write code, submit it for execution, and view results.  
It is built using a **microservices-inspired architecture** with **Next.js (frontend), Express (backend), Redis (queue), and a Worker (executor)**.

---

## Features
- **Code Editor** (frontend built with Next.js 15)
- **Real-time Streaming** of execution logs using **Socket.IO**
- **Job Queue** powered by **Redis**
- **Worker Service** executes jobs from the queue
- **Submission History** stored in frontend state
- **Dockerized Setup** for easy deployment

---

## Architecture

[Frontend (Next.js)] ---> [Backend (Express API + Websocket)] ---> [Redis Queue] ---> [Worker Service]

- **Frontend (Next.js 15 + TypeScript)**  
  UI for writing and submitting code, connects to backend via **Socket.IO** for live results.

- **Backend (Express + TypeScript)**  
  Handles API requests, pushes jobs into **Redis** queue, streams results back to clients.

- **Worker (Node.js + TypeScript)**  
  Consumes jobs from Redis, executes code, sends execution results back.

- **Redis (v7 Alpine)**  
  Used as a queue (Pub/Sub + list).

---

## 📂 Project Structure

leetcode-clone/
│── backend/ # Express backend
│ └── docker/Dockerfile.backend
│── worker/ # Worker service
│ └── docker/Dockerfile.worker
│── frontend/ # Next.js frontend
│ └── docker/Dockerfile.fe
│── docker-compose.yml # Multi-service orchestration
│── README.md # Documentation

yaml

---

## ## Local Development (without Docker)

### 1️⃣ Start Redis
Make sure Redis is installed and running on `localhost:6379`.

```bash
redis-server
## Start Backend
```
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:4000

##  Start Worker
```
cd worker
npm install
npm run dev

```
## Start Frontend
```
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

Run with Docker
Build & Start Services
From root directory:

```
docker compose up -d --build
```
 Access Services
Frontend → http://localhost:3000

Backend → http://localhost:4000

Redis → localhost:6379

Stop Services
```
docker compose down
```
## API Endpoints (Backend)
POST /submit → Submit code for execution

GET /status/:jobId → Get status of a job

WS 

## Graceful Shutdown
Both backend and worker listen for signals:

```
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await redisClient.quit();
  process.exit(0);
});
```
This ensures Redis connections are properly closed.

## TODOs / Future Work
Add multiple language support (Python, Java, C++)

Store submissions in a database (PostgreSQL/MongoDB)

Add user authentication

Deploy using Kuberne