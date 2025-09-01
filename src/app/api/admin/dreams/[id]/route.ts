import { NextRequest, NextResponse } from 'next/server';
import { getDreamById, updateDreamInterpretation, deleteDream } from '@/lib/db';
import { ApiResponse, DreamInterpretation } from '@/types';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'kareem-fuad-admin-2024';

// Verify admin authentication
function verifyAdmin(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
               new URL(request.url).searchParams.get('token');
  return token === ADMIN_TOKEN;
}

// GET /api/admin/dreams/[id] - Get specific dream by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 });
    }

    const { id } = await params;
    const dream = await getDreamById(id);

    if (!dream) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Dream not found'
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse<DreamInterpretation>>({
      success: true,
      data: dream
    });

  } catch (error) {
    console.error('Error fetching dream:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch dream'
    }, { status: 500 });
  }
}

// PUT /api/admin/dreams/[id] - Update specific dream
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { interpretation, interpretedBy, tags, isPublic } = body;

    // Validation
    if (!interpretation) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Interpretation is required'
      }, { status: 400 });
    }

    if (interpretation.length < 10) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Interpretation must be at least 10 characters long'
      }, { status: 400 });
    }

    const updatedDream = await updateDreamInterpretation({
      id,
      interpretation,
      interpretedBy: interpretedBy || 'Kareem Fuad',
      tags: tags || [],
      isPublic: isPublic || false
    });

    if (!updatedDream) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Dream not found'
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse<DreamInterpretation>>({
      success: true,
      data: updatedDream
    });

  } catch (error) {
    console.error('Error updating dream:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to update dream interpretation'
    }, { status: 500 });
  }
}

// DELETE /api/admin/dreams/[id] - Delete specific dream
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteDream(id);

    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Dream not found'
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true
    });

  } catch (error) {
    console.error('Error deleting dream:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to delete dream'
    }, { status: 500 });
  }
}