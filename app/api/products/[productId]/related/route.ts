import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
  try {
    await connectToDB();

    // Fetch the product details
    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    // Find related products based on category or collections
    const relatedProducts = await Product.find({
      $or: [
        { category: product.category },
        { collections: { $in: product.collections } }
      ],
      _id: { $ne: product._id } // Exclude the current product
    });

    // If no related products are found, return an empty array
    if (Array.isArray(relatedProducts) && relatedProducts.length === 0) {
      return new NextResponse(JSON.stringify([]), { status: 200 });
    }

    // Return the related products
    return NextResponse.json(relatedProducts, { status: 200 });
  } catch (err) {
    console.log("[related_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
