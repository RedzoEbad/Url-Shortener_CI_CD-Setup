import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateShortCode, isValidUrl, createShortUrl } from '@/lib/utils';
import { Url } from '@/types/url';

export async function POST(request: NextRequest) {
  try {
    const { originalUrl, customCode } = await request.json();

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('url-shortener');
    const collection = db.collection<Url>('urls');

    let shortCode = customCode;

    if (customCode) {
      const existingUrl = await collection.findOne({ shortCode });
      if (existingUrl) {
        return NextResponse.json(
          { error: 'Custom code already exists' },
          { status: 409 }
        );
      }
    } else {
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 10) {
        shortCode = generateShortCode();
        const existingUrl = await collection.findOne({ shortCode });
        if (!existingUrl) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        return NextResponse.json(
          { error: 'Failed to generate unique short code' },
          { status: 500 }
        );
      }
    }

    const shortUrl = createShortUrl(shortCode!);
    
    const newUrl: Url = {
      originalUrl,
      shortCode: shortCode!,
      shortUrl,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newUrl as any);

    return NextResponse.json({
      id: result.insertedId,
      originalUrl,
      shortCode: shortCode!,
      shortUrl,
      clicks: 0,
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
