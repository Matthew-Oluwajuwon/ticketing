import { dbConnection } from "./db";
import express, { Request, Response } from "express";
import { port } from "./utils/envConfig";
import cors from "cors";
import ticketRouter from "./router/ticket";
import bookingRouter from "./router/booking";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path"; // Import the path module for resolving paths
import dotenv from "dotenv";
import http from "http"; // Import HTTP module
import { Server } from "socket.io"; // Import Socket.IO

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Increase request body size limit
app.use(express.json({ limit: "10mb" })); // Set the limit to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true })); // For form submissions
export const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5001", "http://localhost:9920"], // Your frontend URL
      credentials: true,               // Allow credentials like cookies
    },
  }); // Initialize Socket.IO with the server

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "ZEETICKET",
    version: "1.0.0",
    description: "A simple concert ticketing solution",
  },
  servers: [
    {
      url: "http://localhost:3000", // Replace with your app's URL
      description: "Local server",
    },
    {
      url: "https://ticketing-production.up.railway.app", // Replace with your app's URL
      description: "Production server",
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Ensure the path to your routes is correct; using absolute path or resolve it dynamically
  apis: [path.resolve(__dirname, process.env.DEV === 'true' ? "./router/*.ts" : "./router/*.js")], // Adjust based on your folder structure
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// Use swagger-UI-express for your swagger route
app.use("/swagger/index.html", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to ticket booking RESTful APIs");
});

// Add Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
});

// Use routers
app.use("/api/", ticketRouter);
app.use("/api/bookings/", bookingRouter);

dbConnection();

// Start server with Socket.IO
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
