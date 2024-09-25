import express from "express";
import { getAllBookings, getBookingById, purchaseTicket, verifyTransaction } from "../controller/booking";

const router = express.Router();

router.post("/purchase/:id", purchaseTicket)
router.post("/verify", verifyTransaction)
router.get("/get-all-bookings", getAllBookings)
router.get("/get-one-booking/:id", getBookingById)

export default router