import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Removes any leading or trailing whitespace
    },
    description: {
      type: String,
      required: true,
      trim: true, // Optional: a brief description of the event or ticket
    },
    price: {
      type: Number, // Price should be a number instead of a string
      required: true,
      min: 0, // Ensure the price is not negative
    },
    eventDate: {
      type: Date,
      required: true, // Date of the event
    },
    venue: {
      type: String,
      required: true, // Venue of the event
    },
    noOfPurchase: {
      type: Number,
      min: 0,
      default: 0
    },
    transactionRef: {
      type: String,
    },
    authorizationUrl: {
      type: String,
    },
    category: {
      type: String,
      enum: ["VIP", "REGULAR", "VVIP"], // Categories for ticket types
      required: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "CANCELLED", "OUT_OF_STOCK"], // Ticket status
      default: "AVAILABLE", // Default status is available
    },
    slots: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    image: {
      type: String, // Store the URL of the uploaded image
      required: false, // Optional, since not all tickets may have an image
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);


// Export the model
export const Ticket = mongoose.model("Ticket", ticketSchema);
