"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_1 = require("../controller/ticket");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/create-ticket", ticket_1.createTicket);
router.get("/get-all-tickets", ticket_1.getAllTickets);
router.get("/get-one-ticket/:id", ticket_1.getTicketById);
router.put("/update-ticket/:id", ticket_1.updateTicket);
router.delete("/delete-ticket/:id", ticket_1.deleteTicket);
exports.default = router;
