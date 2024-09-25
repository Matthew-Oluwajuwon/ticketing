import express from "express";
import { getAllBookings, getBookingById, purchaseTicket, verifyTicketCode, verifyTransaction } from "../controller/booking";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Booking
 *     description: Operations related to ticket bookings
 */

/**
 * @swagger
 * /api/bookings/purchase/{id}:
 *   post:
 *     tags: [Booking]
 *     summary: Purchase a ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket to purchase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "m@m.com"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               callbackUrl:
 *                 type: string
 *                 format: uri
 *                 example: "http://localhost:9610"
 *     responses:
 *       200:
 *         description: Purchase successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Purchase successful"
 *                 transactionId:
 *                   type: string
 *                   example: "txn_123456789"
 */
router.post("/purchase/:id", purchaseTicket);

/**
 * @swagger
 * /api/bookings/verify:
 *   post:
 *     tags: [Booking]
 *     summary: Verify a transaction
 *     parameters:
 *       - in: query
 *         name: transactionRef
 *         required: true
 *         schema:
 *           type: string
 *         description: The reference of the transaction to verify
 *     responses:
 *       200:
 *         description: Transaction verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction verified successfully"
 *                 status:
 *                   type: string
 *                   example: "success"
 */
router.post("/verify", verifyTransaction);

/**
 * @swagger
 * /api/bookings/get-all-bookings:
 *   get:
 *     tags: [Booking]
 *     summary: Get all bookings
 *     responses:
 *       200:
 *         description: A list of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bookingId:
 *                     type: string
 *                     example: "booking_123456"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "m@m.com"
 *                   quantity:
 *                     type: integer
 *                     example: 2
 */
router.get("/get-all-bookings", getAllBookings);

/**
 * @swagger
 * /api/bookings/verify-ticket:
 *   post:
 *     tags: [Booking]
 *     summary: Verify ticket code
 *     parameters:
 *       - in: query
 *         name: ticketCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the ticket to be verified
 *     responses:
 *       200:
 *         description: Ticket verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingId:
 *                   type: string
 *                   example: "booking_123456"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "m@m.com"
 *                 quantity:
 *                   type: integer
 *                   example: 2
 */
router.post("/verify-ticket", verifyTicketCode);

/**
 * @swagger
 * /api/bookings/verify:
 *   post:
 *     tags: [Booking]
 *     summary: Verify a transaction
 *     parameters:
 *       - in: query
 *         name: transactionRef
 *         required: true
 *         schema:
 *           type: string
 *         description: The reference of the transaction to verify
 *     responses:
 *       200:
 *         description: Transaction verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction verified successfully"
 *                 status:
 *                   type: string
 *                   example: "success"
 */
router.post("/verify", verifyTransaction);

export default router;
