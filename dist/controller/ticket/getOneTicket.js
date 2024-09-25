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
const getTicketById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract ticket ID from the request parameters
        const { id } = req.params;
        // Fetch the ticket by its ID
        const ticket = yield Ticket_1.Ticket.findById(id);
        // Check if ticket exists
        if (!ticket) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Ticket not found",
                data: null,
            });
        }
        // Respond with the ticket data
        res.status(200).json({
            responseCode: 200,
            responseMessage: "Ticket retrieved successfully",
            data: ticket,
        });
    }
    catch (error) {
        console.error("Error fetching ticket:", error);
        // Check if the error is due to invalid object ID format
        if (error.kind === "ObjectId") {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Invalid ticket ID",
                data: null,
            });
        }
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "An error occurred while fetching the ticket",
            error: error.message,
            data: null,
        });
    }
});
exports.default = getTicketById;
