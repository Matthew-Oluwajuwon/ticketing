import { Request, Response } from "express";
import { Ticket } from "../../model/Ticket";

const getAllTickets = async (req: Request, res: Response) => {
  try {
    // Fetch all tickets from the database
    const page = parseInt(req.query.page as string) || 1;
    const parsedSize = parseInt(req.query.size as string);
    const limit = parsedSize > 100 ? 100 : isNaN(parsedSize) ? 100 : parsedSize;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find().skip(skip).limit(limit);
   const totalTickets = await Ticket.countDocuments();

    // Check if tickets exist
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "No tickets found",
        data: null,
      });
    }
 
    // Respond with the list of tickets
    res.status(200).json({
      responseCode: 200,
      responseMessage: "Tickets retrieved successfully",
      data: {
        total: totalTickets,
        page,
        size: limit,
        tickets: tickets.reverse(),
      },
    });
  } catch (error: any) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "An error occurred while fetching tickets",
      error: error.message,
      data: null,
    });
  }
};

export default getAllTickets;
