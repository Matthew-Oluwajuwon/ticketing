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
const Booking_1 = require("../../model/Booking");
const verifyTicketCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketCode } = req.query; // Get the ticketCode from query parameters
    // Validate the input
    if (!ticketCode) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: "Ticket code is required",
            data: null,
        });
    }
    try {
        // Assuming you have a Booking model to interact with the database
        const booking = yield Booking_1.Booking.findOne({ ticketCode });
        if (!booking) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "Ticket code not found",
                data: null,
            });
        }
        booking.ticketCode = null;
        yield booking.save();
        // Ticket code found, return the booking details
        return res.status(200).json({
            responseCode: 200,
            responseMessage: "Ticket code verified successfully",
            data: true
        });
    }
    catch (error) {
        console.error("Error verifying ticket code:", error);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "Unable to verify ticket code",
            data: null,
        });
    }
});
exports.default = verifyTicketCode;
