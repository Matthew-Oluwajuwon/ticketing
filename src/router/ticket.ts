import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
} from "../controller/ticket";
import express from "express";

const router = express.Router();

router.post("/create-ticket", createTicket);
router.get("/get-all-tickets", getAllTickets);
router.get("/get-one-ticket/:id", getTicketById);
router.put("/update-ticket/:id", updateTicket);
router.delete("/delete-ticket/:id", deleteTicket);

export default router;
