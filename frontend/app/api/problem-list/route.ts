import { NextRequest, NextResponse } from 'next/server';
import { getProblemList, addProblem } from '@/services/api';

export async function GET() {
  try {
    const problems = await getProblemList();
    return NextResponse.json(problems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const term = await request.json();
    const newProblem = await addProblem(term);
    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add problem' },
      { status: 500 }
    );
  }
}
