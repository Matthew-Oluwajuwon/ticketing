"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const db_1 = require("./db");
const express_1 = __importDefault(require("express"));
const envConfig_1 = require("./utils/envConfig");
const cors_1 = __importDefault(require("cors"));
const ticket_1 = __importDefault(require("./router/ticket"));
const booking_1 = __importDefault(require("./router/booking"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path")); // Import the path module for resolving paths
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http")); // Import HTTP module
const socket_io_1 = require("socket.io"); // Import Socket.IO
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app); // Create HTTP server
// Increase request body size limit
app.use(express_1.default.json({ limit: "10mb" })); // Set the limit to 10MB
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true })); // For form submissions
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5001", "http://localhost:9920"], // Your frontend URL
        credentials: true, // Allow credentials like cookies
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
    apis: [path_1.default.resolve(__dirname, process.env.DEV === 'true' ? "./router/*.ts" : "./router/*.js")], // Adjust based on your folder structure
};
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
// Use swagger-UI-express for your swagger route
app.use("/swagger/index.html", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.send("Welcome to ticket booking RESTful APIs");
});
// Add Socket.IO connection
exports.io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
});
// Use routers
app.use("/api/", ticket_1.default);
app.use("/api/bookings/", booking_1.default);
(0, db_1.dbConnection)();
// Start server with Socket.IO
server.listen(envConfig_1.port, () => {
    console.log(`Server is running on port ${envConfig_1.port}`);
});
