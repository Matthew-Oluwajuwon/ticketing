import { Request, Response } from "express";
import { Booking } from "../../model/Booking";

const getAllBookings = async (req: Request, res: Response) => {
  try {
    // Fetch all bookings from the database
    const page = parseInt(req.query.page as string) || 1;
    const parsedSize = parseInt(req.query.size as string);
    const limit = parsedSize > 100 ? 100 : isNaN(parsedSize) ? 100 : parsedSize;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find().skip(skip).limit(limit);

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
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "An error occurred while fetching bookings",
      error: error.message,
      data: null,
    });
  }
};

export default getAllBookings;
