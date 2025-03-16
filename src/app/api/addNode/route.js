import { NextResponse } from 'next/server';
import { connectToDatabase } from '../mongodb';

export async function POST(request) {
  try {
    const nodeData = await request.json();
    console.log('Received nodeData:', nodeData);

    if (
      !nodeData.name ||
      !nodeData.job ||
      !nodeData.location ||
      !nodeData.nationality ||
      !Array.isArray(nodeData.hobbies)
    ) {
      console.error('Invalid node data:', nodeData);
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    if (!db) {
      console.error('MongoDB 연결 실패');
      return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }

    try {
      const insertResult = await db.collection('people').insertOne({
        ...nodeData,
        createdAt: new Date(),
        updatedAt: new Date(), // new Node
      });
      console.log('Insert result:', insertResult);
    } catch (error) {
      console.error('Error inserting node into MongoDB:', error.message);
      return NextResponse.json({ message: 'Database write failed' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Node added successfully' });
  } catch (error) {
    console.error('Error adding node:', error.message);
    console.error(error.stack);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
