import { Request, Response } from "express";
import Joi from "joi";
import { Ticket } from "../model/Ticket";
import cloudinary from "../utils/cloudinaryConfig";

const createTicket = async (req: Request, res: Response) => {
  const {
    title,
    description,
    price,
    eventDate,
    venue,
    category,
    status = "available",
    slots,
    image,
  } = req.body;

  // Schema for validation using Joi
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(8).required(),
    price: Joi.number().positive().required(),
    eventDate: Joi.date().required(),
    venue: Joi.string().min(3).required(),
    category: Joi.string().min(3).required(),
    status: Joi.string(),
    slots: Joi.number().positive().required(),
    image: Joi.string().required(), // This expects the base64 encoded image string
  });

  try {
    // Validate the request body against the schema
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: error.details[0].message?.replace(/\"/g, ""),
        data: null,
      });
    }

    // Upload the image to Cloudinary
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(image);
    } catch (uploadError: any) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        responseCode: 500,
        responseMessage: `Uploading image failed: ${uploadError}`,
        error: uploadError.message,
        data: null,
      });
    }

    // Create a new Ticket document
    const ticket = new Ticket({
      title,
      description,
      price,
      eventDate,
      venue,
      category,
      status,
      slots,
      image: uploadResult.secure_url, // Assign uploaded image URL
    });

    // Save the ticket to the database
    await ticket.save();

    return res.status(201).json({
      responseCode: 201,
      responseMessage: "Ticket created successfully",
      data: ticket,
    });
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "An error occurred while creating the ticket",
      error: error.message,
      data: null,
    });
  }
};

const getAllTickets = async (req: Request, res: Response) => {
  try {
    // Fetch all tickets from the database
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.size as string) > 100 ? 100 : parseInt(req.query.size as string) || 100;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find().skip(skip).limit(limit);

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
        total: tickets.length,
        page,
        size: limit,
        tickets,
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

export { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket };
