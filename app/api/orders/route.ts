import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    // Fetch all orders sorted by createdAt in descending order
    const orders = await Order.find().sort({ createdAt: "desc" });

    // Map through orders and fetch customer details
    const orderDetails = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findOne({ clerkId: order.customerClerkId });

        return {
          _id: order._id,
          customerClerkId: order.customerClerkId,
          email: customer?.email || "N/A", // Use customer email or fallback to "N/A"
          name: customer?.name || "N/A", // Use customer name or fallback to "N/A"
          products: order.products.map((product: any) => ({
            productId: product.product._id,
            title: product.product.title,
            price: product.product.price,
            color: product.color,
            size: product.size,
            quantity: product.quantity,
          })),
          billingDetails: order.billingDetails || null, // Include billing details if available
          shippingDetails: order.shippingDetails || null, // Include shipping details if available
          paymentDetails: order.paymentDetails || null, // Include payment details if available
          totalAmount: order.totalAmount,
          createdAt: format(order.createdAt, "MMM do, yyyy"),
        };
      })
    );

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (err) {
    console.log("[orders_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";