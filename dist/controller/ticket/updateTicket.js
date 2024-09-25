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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const Ticket_1 = require("../../model/Ticket");
const updateTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Define the validation schema for updating the ticket
    const schema = joi_1.default.object({
        title: joi_1.default.string().min(3),
        description: joi_1.default.string().min(8),
        price: joi_1.default.number(),
        eventDate: joi_1.default.date(),
        venue: joi_1.default.string().min(3),
        category: joi_1.default.string().min(3),
        status: joi_1.default.string(),
        slots: joi_1.default.number(),
        image: joi_1.default.string(),
    });
    try {
        // Validate request body
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: error.details[0].message,
                data: null,
            });
        }
        // Find the ticket by ID and update with new data
        const ticket = yield Ticket_1.Ticket.findByIdAndUpdate(id, req.body, { new: true });
        // If ticket is not found
        if (!ticket) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Ticket not found",
                data: null,
            });
        }
        res.status(200).json({
            responseCode: 200,
            responseMessage: "Ticket updated successfully",
            data: ticket,
        });
    }
    catch (error) {
        console.error("Error updating ticket:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Invalid ticket ID",
                data: null,
            });
        }
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "An error occurred while updating the ticket",
            error: error.message,
            data: null,
        });
    }
});
exports.default = updateTicket;
