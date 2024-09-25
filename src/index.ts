import { dbConnection } from "./db";
import express, { Request, Response } from "express";
import { port } from "./utils/envConfig";
import cors from "cors";
import ticketRouter from "./router/ticket";
import bookingRouter from "./router/booking";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import path from 'path'; // Import the path module for resolving paths

import dotenv from "dotenv";

dotenv.config();


const app = express();

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
      url: "http://localhost:3000", // replace with your app's URL
      description: "Local server",
    },
    {
      url: "https://ticketing-production.up.railway.app", // replace with your app's URL
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

app.use("/api/", ticketRouter);
app.use("/api/bookings/", bookingRouter);

dbConnection();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 