import { Request, Response } from "express";
import Joi from "joi";
import { Ticket } from "../../model/Ticket";

const updateTicket = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Define the validation schema for updating the ticket
  const schema = Joi.object({
    title: Joi.string().min(3),
    description: Joi.string().min(8),
    price: Joi.number(),
    eventDate: Joi.date(),
    venue: Joi.string().min(3),
    category: Joi.string().min(3),
    status: Joi.string(),
    slots: Joi.number(),
    image: Joi.string(),
  });

  try {
    // Validate request body
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: error.details[0].message,
        data: null,
      });
    }

    // Find the ticket by ID and update with new data
    const ticket = await Ticket.findByIdAndUpdate(id, req.body, { new: true });

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
      responseMessage: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error: any) {
    console.error("Error updating ticket:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Invalid ticket ID",
        data: null,
      });
    }

    return res.status(500).json({
      responseCode: 500,
      responseMessage: "An error occurred while updating the ticket",
      error: error.message,
      data: null,
    });
  }
};

export default updateTicket;
