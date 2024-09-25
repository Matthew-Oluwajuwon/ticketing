import { Request, Response } from "express";
import { Ticket } from "../../model/Ticket";

const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find and delete the ticket by ID
    const ticket = await Ticket.findByIdAndDelete(id);

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
  } catch (error: any) {
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
};

export default deleteTicket;
