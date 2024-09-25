"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express_1 = __importDefault(require("express"));
const envConfig_1 = require("./utils/envConfig");
const cors_1 = __importDefault(require("cors"));
const ticket_1 = __importDefault(require("./router/ticket"));
const booking_1 = __importDefault(require("./router/booking"));
const statistics_1 = __importDefault(require("./router/statistics"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path")); // Import the path module for resolving paths
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
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
            url: process.env.DEV === 'true' ? "http://locahost:3000" : "https://ticketing-production.up.railway.app", // replace with your app's URL
            description: "Development server",
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
app.use("/api/", ticket_1.default);
app.use("/api/bookings/", booking_1.default);
app.use("/api/statistics/", statistics_1.default);
(0, db_1.dbConnection)();
app.listen(envConfig_1.port, () => {
    console.log(`Server is running on port ${envConfig_1.port}`);
});
