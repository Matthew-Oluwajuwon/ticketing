import { Request, Response } from "express";
import { Ticket } from "../../model/Ticket";
import { Booking } from "../../model/Booking"; // Import the Booking model
import Joi from "joi";
import axios from "axios";

const purchaseTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, quantity, callbackUrl } = req.body; // Get the quantity of tickets

  // Validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    callbackUrl: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(), // Ensure quantity is at least 1
  });

  try {
    // Step 1: Validate the request body
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: error.details[0].message?.replace(/\"/g, ""),
        data: null,
      });
    }

    // Step 2: Find the ticket by ID
    const ticket = await Ticket.findById(id);

    // Step 3: If the ticket does not exist, send a 404 error
    if (!ticket) {
      return res.status(404).json({
        responseCode: 404,
        responseMessage: "Ticket not found.",
        data: null,
      });
    }

    // Step 4: Check if there are enough available slots for the quantity requested
    if (ticket.slots < quantity) {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: `Only ${ticket.slots} slots are available.`,
        data: null,
      });
    }

    // Step 5: Calculate the total amount for the transaction
    const totalAmount = ticket.price * quantity;

    // Step 6: Initialize the payment with Paystack
    const paystackResponse = await axios.post(
      process.env.PAYSTACK_API_BASE_URL + "initialize",
      {
        amount: totalAmount * 100, // Paystack expects the amount in kobo (for NGN)
        email,
        callback_url: callbackUrl
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    // Step 7: If the payment is initialized successfully, create a booking and update the ticket
    if (paystackResponse.data?.status) {
      const { reference, authorization_url } = paystackResponse.data?.data;

      // Create a new booking document
      const booking = new Booking({
        buyerEmail: email,
        ticket: ticket._id,
        quantity,
        totalAmount,
        transactionRef: reference,
        authorizationUrl: authorization_url,
        paymentStatus: "PENDING", // Initially pending until the payment is confirmed
      });

      // Save the booking
      await booking.save();

      // Deduct the number of slots available
      ticket.slots -= quantity;
      await ticket.save();

      // Respond with the authorization URL and booking info
      res.status(200).json({
        responseCode: 200,
        responseMessage: "Transaction initialized successfully",
        data: {
          authorization_url,
          transactionRef: reference,
          totalAmount,
          quantity,
          email,
        },
      });
    } else {
      console.log(paystackResponse.data);
      res.status(500).json({
        responseCode: 500,
        responseMessage: "Unable to initialize transaction",
        data: null,
      });
    }
  } catch (error: any) {
    console.error("Error purchasing ticket:", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal server error",
      error: error.message,
      data: null,
    });
  }
};

export default purchaseTicket;
