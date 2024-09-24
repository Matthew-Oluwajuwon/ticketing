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
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('Welcome to ticket booking RESTful APIs');
});
app.use("/api/", ticket_1.default);
(0, db_1.dbConnection)();
app.listen(envConfig_1.port, () => {
    console.log(`Server is running on port ${envConfig_1.port}`);
});
