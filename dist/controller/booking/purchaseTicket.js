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
const Ticket_1 = require("../../model/Ticket");
const Booking_1 = require("../../model/Booking"); // Import the Booking model
const joi_1 = __importDefault(require("joi"));
const axios_1 = __importDefault(require("axios"));
const purchaseTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id } = req.params;
    const { email, quantity, callbackUrl } = req.body; // Get the quantity of tickets
    // Validation schema
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        callbackUrl: joi_1.default.string().required(),
        quantity: joi_1.default.number().integer().min(1).required(), // Ensure quantity is at least 1
    });
    try {
        // Step 1: Validate the request body
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: (_a = error.details[0].message) === null || _a === void 0 ? void 0 : _a.replace(/\"/g, ""),
                data: null,
            });
        }
        // Step 2: Find the ticket by ID
        const ticket = yield Ticket_1.Ticket.findById(id);
        // Step 3: If the ticket does not exist, send a 404 error
        if (!ticket) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Ticket not found.",
                data: null,
            });
        }
        // Step 4: Check if there are enough available slots for the quantity requested
        if (ticket.slots < quantity) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: `Only ${ticket.slots} slots are available.`,
                data: null,
            });
        }
        // Step 5: Calculate the total amount for the transaction
        const totalAmount = ticket.price * quantity;
        // Step 6: Initialize the payment with Paystack
        const paystackResponse = yield axios_1.default.post(process.env.PAYSTACK_API_BASE_URL + "initialize", {
            amount: totalAmount * 100, // Paystack expects the amount in kobo (for NGN)
            email,
            callback_url: callbackUrl
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });
        // Step 7: If the payment is initialized successfully, create a booking and update the ticket
        if ((_b = paystackResponse.data) === null || _b === void 0 ? void 0 : _b.status) {
            const { reference, authorization_url } = (_c = paystackResponse.data) === null || _c === void 0 ? void 0 : _c.data;
            // Create a new booking document
            const booking = new Booking_1.Booking({
                buyerEmail: email,
                ticket: ticket._id,
                quantity,
                totalAmount,
                transactionRef: reference,
                authorizationUrl: authorization_url,
                paymentStatus: "PENDING", // Initially pending until the payment is confirmed
            });
            // Save the booking
            yield booking.save();
            // Deduct the number of slots available
            ticket.slots -= quantity;
            yield ticket.save();
            // Respond with the authorization URL and booking info
            res.status(200).json({
                responseCode: 200,
                responseMessage: "Transaction initialized successfully",
                data: {
                    authorization_url,
                    transactionRef: reference,
                    totalAmount,
                    quantity,
                    email,
                },
            });
        }
        else {
            console.log(paystackResponse.data);
            res.status(500).json({
                responseCode: 500,
                responseMessage: "Unable to initialize transaction",
                data: null,
            });
        }
    }
    catch (error) {
        console.error("Error purchasing ticket:", error);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal server error",
            error: error.message,
            data: null,
        });
    }
});
exports.default = purchaseTicket;
