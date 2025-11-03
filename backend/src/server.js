import express from "express";
import "../instrument.mjs";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConnect.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";
import { chatRoutes } from "./routes/chat.route.js";
import listRoutes from "./routes/list.route.js";
import * as Sentry from "@sentry/node";
const app = express();
import cors from "cors";

// Middleware Calls
app.use(express.json());
app.use(cors({ origin: process.env.origin, credentials: true }));
app.use(clerkMiddleware()); //req.auth will be available in the req obj

//Route Middleware Registeration
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/lists", listRoutes);

dotenv.config();
const port = process.env.port;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

Sentry.setupExpressErrorHandler(app);
const startServer = async () => {
  try {
    await connectDB();
    // Listen on all environments except when deployed to Vercel (serverless)
    // In Docker, we need to listen even in production
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.DOCKER_ENV === "true"
    ) {
      app.listen(port, "0.0.0.0", () => {
        console.log(`Server is listening at http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

startServer();

export default app;
