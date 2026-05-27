import dotenv from "dotenv";
import { app } from "./app";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 CompFlow Server is running on http://localhost:${PORT}`);
  console.log(`🟢 Health Check: http://localhost:${PORT}/health`);
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed successfully.");
    process.exit(0);
  });
});
