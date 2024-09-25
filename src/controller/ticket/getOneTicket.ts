import { Request, Response } from "express";
import { Ticket } from "../../model/Ticket";

const getTicketById = async (req: Request, res: Response) => {
  try {
    // Extract ticket ID from the request parameters
    const { id } = req.params;

    // Fetch the ticket by its ID
    const ticket = await Ticket.findById(id);

    // Check if ticket exists
    if (!ticket) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "Ticket not found",
        data: null,
      });
    }

    // Respond with the ticket data
    res.status(200).json({
      responseCode: 200,
      responseMessage: "Ticket retrieved successfully",
      data: ticket,
    });
  } catch (error: any) {
    console.error("Error fetching ticket:", error);

    // Check if the error is due to invalid object ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Invalid ticket ID",
        data: null,
      });
    }

    return res.status(500).json({
      responseCode: 500,
      responseMessage: "An error occurred while fetching the ticket",
      error: error.message,
      data: null,
    });
  }
};

export default getTicketById;
