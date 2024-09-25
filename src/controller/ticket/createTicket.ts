import { Request, Response } from "express";
import Joi from "joi";
import { Ticket } from "../../model/Ticket";
import cloudinary from "../../utils/cloudinaryConfig";

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

export default createTicket;
