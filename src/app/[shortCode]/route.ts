import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Url } from '@/types/url';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    if (!shortCode) {
      return NextResponse.json(
        { error: 'Short code is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('url-shortener');
    const collection = db.collection<Url>('urls');

    const url = await collection.findOne({ shortCode });

    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Update clicks and timestamp
    await collection.updateOne(
      { _id: url._id },
      { 
        $inc: { clicks: 1 },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
