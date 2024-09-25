import { Request, Response } from "express";
import { Booking } from "../../model/Booking";

const verifyTicketCode = async (req: Request, res: Response) => {
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
    const booking = await Booking.findOne({ ticketCode });

    if (!booking) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "Ticket code not found",
        data: null,
      });
    }

    booking.ticketCode = null
    await booking.save()

    // Ticket code found, return the booking details
    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Ticket code verified successfully",
      data: true
    });
  } catch (error) {
    console.error("Error verifying ticket code:", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Unable to verify ticket code",
      data: null,
    });
  }
};

export default verifyTicketCode;
