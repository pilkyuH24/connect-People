import { NextResponse } from "next/server";
import { connectToDatabase } from "../mongodb";

export async function GET(request) {
  try {
    // Parse query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const since = searchParams.get("since"); // `since` timestamp received from the client

    // Connect to the database
    const { db } = await connectToDatabase();
    if (!db) {
      console.error("Failed to connect to MongoDB");
      return NextResponse.json({ message: "Database connection failed" }, { status: 500 });
    }

    // Initialize the query object
    let query = {};
    if (since) {
      // Filter only the data that has been updated after the `since` timestamp
      query.updatedAt = { $gt: new Date(since) };
    }

    // Fetch the filtered nodes from the "people" collection
    const nodes = await db.collection("people").find(query).toArray();

    // Return the nodes along with the latest update timestamp
    return NextResponse.json({
      nodes,
      lastUpdate: new Date().toISOString(), // Send the latest update timestamp
    });
  } catch (error) {
    console.error("Error fetching nodes:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
