import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/services/api';

export async function POST(request: NextRequest) {
  try {
    const { abhaId } = await request.json();
    
    if (!abhaId) {
      return NextResponse.json(
        { error: 'ABHA ID is required' },
        { status: 400 }
      );
    }

    const result = await login(abhaId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    );
  }
}
