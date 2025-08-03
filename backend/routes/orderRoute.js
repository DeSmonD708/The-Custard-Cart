import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder,getUserOrders, verifyOrder, listOrders, updateStatus } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",authMiddleware,verifyOrder);
orderRouter.get("/myorders",authMiddleware,getUserOrders);
orderRouter.get('/list',listOrders);
orderRouter.post("/status",updateStatus);




export default orderRouter;