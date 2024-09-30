"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ticket_1 = require("../../model/Ticket");
const getAllTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all tickets from the database
        const page = parseInt(req.query.page) || 1;
        const parsedSize = parseInt(req.query.size);
        const limit = parsedSize > 100 ? 100 : isNaN(parsedSize) ? 100 : parsedSize;
        const skip = (page - 1) * limit;
        const tickets = yield Ticket_1.Ticket.find().skip(skip).limit(limit);
        const totalTickets = yield Ticket_1.Ticket.countDocuments();
        // Check if tickets exist
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "No tickets found",
                data: null,
            });
        }
        // Respond with the list of tickets
        res.status(200).json({
            responseCode: 200,
            responseMessage: "Tickets retrieved successfully",
            data: {
                total: totalTickets,
                page,
                size: limit,
                tickets: tickets.reverse(),
            },
        });
    }
    catch (error) {
        console.error("Error fetching tickets:", error);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "An error occurred while fetching tickets",
            error: error.message,
            data: null,
        });
    }
});
exports.default = getAllTickets;
