import Order from "../../models/order.model";

export const createOrder = async (req, res) => {
  const { orderId, paymentId, userId } = req.body;

  if (!orderId || !paymentId || !userId) {
    return res
      .status(400)
      .json({ error: "Please provide orderId, paymentId, and userId" });
  }

  try {
    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      return res
        .status(400)
        .json({ error: "Order with this orderId already exists" });
    }
    const newOrder = new Order({
      orderId,
      paymentId,
      userId,
    });
    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};
