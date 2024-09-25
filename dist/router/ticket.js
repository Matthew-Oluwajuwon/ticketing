"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticket_1 = require("../controller/ticket");
const router = express_1.default.Router();
/**
 * @swagger
 *   tags:
 *   name: Tickets
 *   description: Ticket management endpoints
 *
 * /api/tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: A list of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123"
 *                   title:
 *                     type: string
 *                     example: "Concert Ticket"
 */
router.get("/tickets", ticket_1.getAllTickets);
/**
 * @swagger
 *   tags:
 *   name: Tickets
 *   description: Ticket management endpoints
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: A single ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123"
 *                 title:
 *                   type: string
 *                   example: "Concert Ticket"
 */
router.get("/tickets/:id", ticket_1.getTicketById);
/**
 * @swagger
 *   tags:
 *   name: Tickets
 *   description: Ticket management endpoints
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: ""
 *               price:
 *                 type: number
 *                 example: 20
 *               description:
 *                 type: string
 *                 example: ""
 *               eventDate:
 *                 type: date
 *                 example: ""
 *               venue:
 *                 type: string
 *                 example: ""
 *               category:
 *                 type: string
 *                 enum:
 *                   - REGULAR
 *                   - VIP
 *                   - VVIP
 *               status:
 *                 type: string
 *                 enum:
 *                   - AVAILABLE
 *                   - CANCELLED
 *               slots:
 *                 type: number
 *                 example: 0
 *               image:
 *                 type: string
 *                 example: ""
 *     responses:
 *       201:
 *         description: Ticket created
 */
router.post("/tickets", ticket_1.createTicket);
/**
 * @swagger
 *   tags:
 *   name: Tickets
 *   description: Ticket management endpoints
 * /api/tickets/{id}:
 *   put:
 *     summary: Update a ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Ticket"
 *     responses:
 *       200:
 *         description: Ticket updated
 */
router.put("/tickets/:id", ticket_1.updateTicket);
/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Delete a ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ticket ID
 *     responses:
 *       204:
 *         description: Ticket deleted
 */
router.delete("/tickets/:id", ticket_1.deleteTicket);
exports.default = router;
