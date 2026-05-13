import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Url, UrlStats } from '@/types/url';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('url-shortener');
    const collection = db.collection<Url>('urls');

    const totalUrls = await collection.countDocuments();
    const totalClicks = await collection.aggregate([
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]).toArray();

    const recentUrls = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    const stats: UrlStats = {
      totalUrls,
      totalClicks: totalClicks[0]?.total || 0,
      recentUrls: recentUrls.map((url: Url) => ({
        ...url,
        _id: url._id?.toString(),
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
