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
const getAllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all bookings from the database
        const page = parseInt(req.query.page) || 1;
        const parsedSize = parseInt(req.query.size);
        const limit = parsedSize > 100 ? 100 : isNaN(parsedSize) ? 100 : parsedSize;
        const skip = (page - 1) * limit;
        const bookings = yield Booking_1.Booking.find().skip(skip).limit(limit);
        // Check if bookings bookings
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: "No bookings found",
                data: null,
            });
        }
        // Respond with the list of bookings
        res.status(200).json({
            responseCode: 200,
            responseMessage: "Bookings retrieved successfully",
            data: {
                total: bookings.length,
                page,
                size: limit,
                bookings,
            },
        });
    }
    catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({
            responseCode: 500,
            responseMessage: "An error occurred while fetching bookings",
            error: error.message,
            data: null,
        });
    }
});
exports.default = getAllBookings;
