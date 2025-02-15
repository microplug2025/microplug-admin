import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";

// Handle POST request for creating a new product
export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
      quantity, // Add quantity field
      datasheet, // Include datasheet URL field
    } = await req.json();

    if (!title || !description || !media || !category || !price || !expense || quantity === undefined) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }

    // Create the new product with quantity and datasheet field
    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
      quantity, // Save quantity
      datasheet, // Save datasheet URL
    });

    await newProduct.save();

    // Update collections if provided
    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// Handle GET request to fetch all products
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    // Fetch all products and ensure quantity and datasheet are included
    const products = await Product.find()
      .sort({ createdAt: "desc" }) // Sorting by creation date in descending order
      .select('title description media category collections tags sizes colors price expense quantity datasheet') // Explicitly include quantity and datasheet fields
      .populate({ path: "collections", model: Collection }); // Populating collections

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
