import { NextRequest, NextResponse } from 'next/server';
import { searchTerminology } from '@/services/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json([]);
    }

    const results = await searchTerminology(query);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
