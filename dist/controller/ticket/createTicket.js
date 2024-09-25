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
const cloudinaryConfig_1 = __importDefault(require("../../utils/cloudinaryConfig"));
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
exports.default = createTicket;
