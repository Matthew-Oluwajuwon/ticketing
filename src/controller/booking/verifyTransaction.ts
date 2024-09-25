import axios from "axios";
import { Request, Response } from "express";
import { Booking } from "../../model/Booking";
import { TransactionInfo } from "../../model/type";

const verifyTransaction = async (req: Request, res: Response) => {
  const { transactionRef } = req.query; // Get the transaction reference from the callback URL

  if (!transactionRef) {
    return res.status(400).json({
      responseCode: 400,
      responseMessage: "Transaction ID not found",
      data: null,
    });
  }

  try {
    let booking = (await Booking.findOne({transactionRef})) as any;
    // Make the verification request
    const response = await axios.get(
      `${process.env.PAYSTACK_API_BASE_URL}verify/${booking?.transactionRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, data } = response.data;

    if (status) {
      // Transaction was successful
      const transactionDetails: TransactionInfo = data;
      // Process transactionDetails (e.g., save to DB, deliver product)
      booking.paymentStatus = "COMPLETED";
      booking.updatedAt = new Date().toJSON();

        await booking.save()

      res.status(200).json({
        responseCode: 200,
        responseMessage: "Transaction successful",
        data: {
            paymentStatus: booking.paymentStatus,
            reference: transactionDetails.reference,
            gateway_response: transactionDetails.gateway_response,
            amount: booking.totalAmount,
            quantity: booking.quantity,
            paid_at: transactionDetails.paid_at,
            currency: transactionDetails.currency,
            fees: transactionDetails.fees,
            customer: transactionDetails.customer,
            transnactionDate: booking.createdAt
        },
      });
    } else {
      // Transaction failed
      booking.status = "FAILED";
      booking.updatedAt = new Date().toJSON();
      res.status(400).json({
        responseCode: 400,
        responseMessage: "Transaction verification failed",
        data: null,
      });
    }
  } catch (error: any) {
    console.error("Error verifying transaction:", error.message);
    res.status(500).send("Internal server error");
  }
};

export default verifyTransaction;
