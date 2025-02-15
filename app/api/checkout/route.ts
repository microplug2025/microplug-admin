import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/models/Order"; // Import the Order model
import { connectToDB } from "@/lib/mongoDB"; // Import the database connection utility
import Customer from "@/lib/models/Customer";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDB();
  
    // Parse the request body
    const {
      customer,
      cartItems,
      billingDetails,
      shippingDetails,
      paymentDetails,
      totalAmount,
    } = await req.json();

    // Validate required data
    if (
      !customer ||
      !cartItems ||
      !billingDetails ||
      !shippingDetails ||
      !paymentDetails ||
      !totalAmount
    ) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    // Map cart items to the products array in the order schema
    const products = cartItems.map((cartItem: any) => ({
      product: cartItem.item._id, // Product ID
      title: cartItem.item.title, // Include the product title
      color: cartItem.color || null, // Optional color
      size: cartItem.size || null, // Optional size
      quantity: cartItem.quantity, // Quantity
    }));
   
  // **Check if customer exists in the database**
  let existingCustomer = await Customer.findOne({ clerkId: customer.clerkId });
  if (!existingCustomer) {
    // **Create a new customer record if not found**
    existingCustomer = new Customer({
      clerkId: customer.clerkId,
      name: customer.name,
      email: customer.email,
      orders: [], // Initialize with an empty order list
    });
    await existingCustomer.save(); 
  }

    // Create a new order document
    const order = new Order({
      customerClerkId: customer.clerkId, // Clerk ID of the customer
      email: customer.email, // Customer's email
      name: customer.name, // Customer's full name
      products, // Array of products with title
      billingDetails, // Billing details
      shippingDetails, // Shipping details
      paymentDetails, // Payment details
      totalAmount, // Total amount including shipping
    });

    // Save the order to the database
    await order.save();   
    // Return a success response
    return NextResponse.json(
      { message: "Order created successfully", orderId: order._id },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}