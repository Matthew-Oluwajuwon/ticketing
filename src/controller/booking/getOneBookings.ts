import { Request, Response } from "express";
import { Booking } from "../../model/Booking";

const getBookingById = async (req: Request, res: Response) => {
  try {
    // Extract booking ID from the request parameters
    const { id } = req.params;

    // Fetch the booking by its ID
    const booking = await Booking.findById(id);

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "Booking not found",
        data: null,
      });
    }

    // Respond with the booking data
    res.status(200).json({
      responseCode: 200,
      responseMessage: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error: any) {
    console.error("Error fetching booking:", error);

    // Check if the error is due to invalid object ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Invalid booking ID",
        data: null,
      });
    }

    return res.status(500).json({
      responseCode: 500,
      responseMessage: "An error occurred while fetching the booking",
      error: error.message,
      data: null,
    });
  }
};

export default getBookingById;
