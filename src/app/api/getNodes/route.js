import { NextResponse } from 'next/server';
import { connectToDatabase } from '../mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const nodes = await db.collection('people').find({}).toArray();
    return NextResponse.json({ nodes, lastUpdate: new Date() });
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
