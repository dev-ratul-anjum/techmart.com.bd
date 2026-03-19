import "dotenv/config";
import { Server } from "http";
import { prisma } from "./prisma/prisma.js";
import app from "./app.js";
import { env } from "./utils/env.js";

let server: Server;

// Start the server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    server = app.listen(env.PORT, () => {
      console.log(`Server started on http://localhost:${env.PORT}`);
    });
  } catch (error: any) {
    console.log(`Failed to start the server :`, error.message);
    process.exit(1);
  }
};
startServer();

// Handle Server Errors
const shutDown = (message: string) => {
  console.error(message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
};

process.on("unhandledRejection", (err: { message: string }) => {
  shutDown(`Unhandled Promise Rejection occurred : ${err.message}`);
});

process.on("uncaughtException", (err) => {
  shutDown(`Uncaught Exception occurred : ${err.message}`);
});

process.on("SIGTERM", () => {
  shutDown("SIGTERM received. Server is shutting down gracefully...");
});

process.on("SIGINT", () => {
  shutDown("SIGINT received. Server is shutting down gracefully...");
});
