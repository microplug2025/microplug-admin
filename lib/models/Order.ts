import mongoose from "mongoose";

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Order; // Clear cached model in development
}

const orderSchema = new mongoose.Schema({
  customerClerkId: String, // Clerk ID of the customer
  email: String, // Customer's email
  name: String, // Customer's full name
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
      },
      title: String, // Add the product title here
      color: String, // Selected color of the product
      size: String, // Selected size of the product
      quantity: Number, // Quantity of the product
    },
  ],
  billingDetails: {
    firstName: String, // Customer's first name
    lastName: String, // Customer's last name
    companyName: String, // Optional company name
    townCity: String, // Town or city
    phoneNumber: String, // Phone number
    orderNotes: String, // Optional order notes
  },
  shippingDetails: {
    shippingMethod: String, // Selected shipping method
    shippingCost: Number, // Shipping cost
  },
  paymentDetails: {
    mpesaName: String, // Name associated with Mpesa
    mobileNumber: String, // Mobile number used for Mpesa
    transactionCode: String, // Mpesa transaction code
  },
  totalAmount: Number, // Total amount including shipping
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp of order creation
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;