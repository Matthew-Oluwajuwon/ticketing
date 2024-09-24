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
exports.deleteTicket = exports.updateTicket = exports.getTicketById = exports.getAllTickets = exports.createTicket = void 0;
const joi_1 = __importDefault(require("joi"));
const Ticket_1 = require("model/Ticket");
const cloudinaryConfig_1 = __importDefault(require("utils/cloudinaryConfig"));
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, price, eventDate, venue, category, status = "available", slots, image, } = req.body;
    // Schema for validation using Joi
    const schema = joi_1.default.object({
        title: joi_1.default.string().min(3).required(),
        description: joi_1.default.string().min(8).required(),
        price: joi_1.default.number().positive().required(),
        eventDate: joi_1.default.date().required(),
        venue: joi_1.default.string().min(3).required(),
        category: joi_1.default.string().min(3).required(),
        status: joi_1.default.string(),
        slots: joi_1.default.number().positive().required(),
        image: joi_1.default.string().required(), // This expects the base64 encoded image string
    });
    try {
        // Validate the request body against the schema
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: (_a = error.details[0].message) === null || _a === void 0 ? void 0 : _a.replace(/\"/g, ""),
                data: null,
            });
        }
        // Upload the image to Cloudinary
        let uploadResult;
        try {
            uploadResult = yield cloudinaryConfig_1.default.uploader.upload(image);
        }
        catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            return res.status(500).json({
                responseCode: 500,
                responseMessage: `Uploading image failed: ${uploadError}`,
                error: uploadError.message,
                data: null,
            });
        }
        // Create a new Ticket document
        const ticket = new Ticket_1.Ticket({
            title,
            description,
            price,
            eventDate,
            venue,
            category,
            status,
            slots,
            image: uploadResult.secure_url, // Assign uploaded image URL
        });
        // Save the ticket to the database
        yield ticket.save();
        return res.status(201).json({
            responseCode: 201,
            responseMessage: "Ticket created successfully",
            data: ticket,
        });
    }
    catch (error) {
        console.error("Error creating ticket:", error);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "An error occurred while creating the ticket",
            error: error.message,
            data: null,
        });
    }
});
exports.createTicket = createTicket;
const getAllTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all tickets from the database
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 100;
        const skip = (page - 1) * limit;
        const tickets = yield Ticket_1.Ticket.find().skip(skip).limit(limit);
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
                total: tickets.length,
                page,
                size: limit,
                tickets,
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
exports.getAllTickets = getAllTickets;
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
exports.getTicketById = getTicketById;
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
exports.updateTicket = updateTicket;
const deleteTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Find and delete the ticket by ID
        const ticket = yield Ticket_1.Ticket.findByIdAndDelete(id);
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
            responseMessage: "Ticket deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Error deleting ticket:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Invalid ticket ID",
                data: null,
            });
        }
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "An error occurred while deleting the ticket",
            error: error.message,
            data: null,
        });
    }
});
exports.deleteTicket = deleteTicket;
