import mongoose from "mongoose";
import { Ticket } from "./Ticket"; // Correct import for the Ticket model

const bookingSchema = new mongoose.Schema(
  {
    buyerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket", // Referencing the Ticket schema
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // At least one ticket must be purchased
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0, // Total amount based on ticket price and quantity
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING", // Default status is pending
    },
    transactionRef: {
      type: String,
      required: true, // Unique reference for the transaction
    },
    authorizationUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "PENDING"],
      default: "PENDING", // Initial status is pending
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Export the model
export const Booking = mongoose.model("Booking", bookingSchema);
