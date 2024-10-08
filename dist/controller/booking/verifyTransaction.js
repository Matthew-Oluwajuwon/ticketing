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
const axios_1 = __importDefault(require("axios"));
const Booking_1 = require("../../model/Booking");
const helper_1 = require("../../utils/helper");
const index_1 = require("../../index");
const verifyTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionRef } = req.query; // Get the transaction reference from the callback URL
    if (!transactionRef) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: "Transaction ID not found",
            data: null,
        });
    }
    try {
        // Make the verification request
        let booking = (yield Booking_1.Booking.findOne({ transactionRef }));
        const response = yield axios_1.default.get(`${process.env.PAYSTACK_API_BASE_URL}verify/${booking === null || booking === void 0 ? void 0 : booking.transactionRef}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });
        const { status, data } = response.data;
        if (status) {
            // Transaction was successful
            const transactionDetails = data;
            // Process transactionDetails (e.g., save to DB, deliver product)
            booking.paymentStatus = "COMPLETED";
            booking.ticketCode = (0, helper_1.generateRandomString)(6);
            booking.updatedAt = new Date().toJSON();
            yield booking.save();
            // Emit a notification to all connected clients
            index_1.io.emit("ticketPurchased", {
                message: `A new ticket has been purchased ${booking.ticketCode}`,
            });
            res.status(200).json({
                responseCode: 200,
                responseMessage: "Transaction verified successfully",
                data: {
                    paymentStatus: booking.paymentStatus,
                    ticketCode: booking.ticketCode,
                    reference: transactionDetails.reference,
                    gateway_response: transactionDetails.gateway_response,
                    amount: booking.totalAmount,
                    quantity: booking.quantity,
                    paid_at: transactionDetails.paid_at,
                    currency: transactionDetails.currency,
                    fees: transactionDetails.fees,
                    customer: transactionDetails.customer,
                    transactionDate: booking.createdAt,
                },
            });
        }
        else {
            // Transaction failed
            booking.status = "FAILED";
            booking.updatedAt = new Date().toJSON();
            res.status(400).json({
                responseCode: 400,
                responseMessage: "Transaction verification failed",
                data: null,
            });
        }
    }
    catch (error) {
        console.error("Error verifying transaction:", error.message);
        res.status(500).json({
            responseCode: 500,
            responseMessage: "Internal server error",
            error: error.message,
            data: null,
        });
    }
});
exports.default = verifyTransaction;
