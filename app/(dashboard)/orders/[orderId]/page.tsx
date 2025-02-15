import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColums";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  try {
    // Fetch updated order details
    const res = await fetch(
      `${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch order details.");
    }

    const { orderDetails, customer } = await res.json();

    console.log("Order API Response:", { orderDetails, customer });

    if (!orderDetails) {
      return (
        <div className="flex flex-col items-center justify-center p-10 text-red-500 text-lg font-semibold">
          Error: Order details not found.
        </div>
      );
    }

    const formattedCreatedAt = orderDetails.createdAt
      ? new Date(orderDetails.createdAt).toLocaleString()
      : "N/A";

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-lg rounded-lg">
        {/* Order Header */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          <p className="text-gray-600">Order ID: {orderDetails._id || "N/A"}</p>
        </div>

        {/* Customer Details */}
        {customer && (
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Customer Details</h3>
            <p className="text-gray-700"><span className="font-medium">Name:</span> {customer.name || "N/A"}</p>
            <p className="text-gray-700"><span className="font-medium">Email:</span> {customer.email || "N/A"}</p>
          </div>
        )}

        {/* Billing Details */}
        {orderDetails.billingDetails && (
          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Billing Details</h3>
            <p className="text-gray-700"><span className="font-medium">Name:</span> {orderDetails.billingDetails.firstName} {orderDetails.billingDetails.lastName}</p>
            <p className="text-gray-700"><span className="font-medium">Phone:</span> {orderDetails.billingDetails.phoneNumber || "N/A"}</p>
            <p className="text-gray-700"><span className="font-medium">City:</span> {orderDetails.billingDetails.townCity || "N/A"}</p>
            {orderDetails.billingDetails.companyName && <p className="text-gray-700"><span className="font-medium">Company:</span> {orderDetails.billingDetails.companyName}</p>}
            {orderDetails.billingDetails.orderNotes && <p className="text-gray-700"><span className="font-medium">Notes:</span> {orderDetails.billingDetails.orderNotes}</p>}
          </div>
        )}

        {/* Shipping Details */}
        {orderDetails.shippingDetails && (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">Shipping Details</h3>
            <p className="text-gray-700"><span className="font-medium">Method:</span> {orderDetails.shippingDetails.shippingMethod || "N/A"}</p>
            <p className="text-gray-700"><span className="font-medium">Cost:</span> KSh{orderDetails.shippingDetails.shippingCost || "N/A"}</p>
          </div>
        )}

        {/* Payment Details */}
        {orderDetails.paymentDetails && (
          <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Payment Details</h3>
            <p className="text-gray-700"><span className="font-medium">Mpesa Name:</span> {orderDetails.paymentDetails.mpesaName || "N/A"}</p>
            <p className="text-gray-700"><span className="font-medium">Mobile:</span> {orderDetails.paymentDetails.mobileNumber || "N/A"}</p>
            <p className="text-gray-700"><span className="font-medium">Transaction Code:</span> {orderDetails.paymentDetails.transactionCode || "N/A"}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="p-4 bg-gray-100 border-l-4 border-gray-400 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
          <p className="text-gray-700"><span className="font-medium">Total Amount:</span> KSh{orderDetails.totalAmount?.toFixed(2) || "N/A"}</p>
          <p className="text-gray-700"><span className="font-medium">Created At:</span> {formattedCreatedAt}</p>
        </div>

        {/* Product Table */}
        {orderDetails.products?.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <DataTable columns={columns} data={orderDetails.products} searchKey="product" />
          </div>
        ) : (
          <p className="text-gray-500 text-center">No products found in this order.</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching order details:", error);
    return (
      <div className="flex flex-col items-center justify-center p-10 text-red-500 text-lg font-semibold">
        Error loading order details. Please try again later.
      </div>
    );
  }
};

export default OrderDetails;
