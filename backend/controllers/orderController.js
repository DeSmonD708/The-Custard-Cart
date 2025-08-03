// controllers/orderController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"; 
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    const deliveryCharge = 40;
    const productAmount = req.body.amount;
    const totalAmount = productAmount;

    const newOrder = new orderModel({
      userId: req.user._id,
      items: req.body.items,
      amount: productAmount,
      deliveryCharge,
      totalAmount,
      address: req.body.address,
      status: "pending",
      payment: false
    });
    await newOrder.save();

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `${newOrder._id}`,
     

    })
    
    // Delete after 15 mins if not paid
    setTimeout(async () => {
      const order = await orderModel.findById(newOrder._id);
      if (order && !order.payment) {
        await orderModel.findByIdAndDelete(order._id);
      }
    }, 15 * 60 * 1000);

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR"
    });

  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ success: false, message: "Order failed" });
  }
};
export const verifyOrder = async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
await userModel.findByIdAndUpdate(req.user._id, { cartData: {} });
return res.status(200).json({ success: true, message: "Payment verified successfully" });
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    console.log("📥 Incoming request to /myorders");
    console.log("🧑 Authenticated user:", req.user);

    if (!req.user || !req.user._id) {
      console.log("❌ No valid user found in req.user");
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const orders = await orderModel.find({ userId: req.user._id }).sort({ createdAt: -1 });

    console.log("✅ Orders fetched:", orders.length);
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error in getUserOrders:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const listOrders = async (req,res) => {
   try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
   } catch (error) {
    console.log(error);
    res.json({success:true,message:"Error"})
   }
};

export const updateStatus = async (req,res) =>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"Order status updated successfully"})
  }catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})
  }
};