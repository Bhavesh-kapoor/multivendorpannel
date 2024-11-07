import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderid: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: Boolean,
      required: true,
    },
    orderStatus: {
      type: Boolean,
      required: true,
    },
  },
  { timeStamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
