import { NextRequest, NextResponse } from 'next/server';
import { removeProblem } from '@/services/api';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await removeProblem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove problem' },
      { status: 500 }
    );
  }
}
