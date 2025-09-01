import { NextRequest, NextResponse } from 'next/server';
import { 
  getDreamsWithFilters, 
  updateDreamInterpretation, 
  deleteDream,
  getDreamsCountByStatus 
} from '@/lib/db';
import { ApiResponse, DreamInterpretation, DreamFilters } from '@/types';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'kareem-fuad-admin-2024';

// Verify admin authentication
function verifyAdmin(request: NextRequest): boolean {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || request.headers.get('authorization')?.replace('Bearer ', '');
  return token === ADMIN_TOKEN;
}

// GET /api/admin/dreams - Get all dreams with advanced filtering
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const gender = searchParams.get('gender') as 'male' | 'female' | null;
    const maritalStatus = searchParams.get('maritalStatus') as 'single' | 'married' | null;
    const status = searchParams.get('status') as 'pending' | 'interpreted' | 'archived' | null;
    const sortByParam = searchParams.get('sortBy') || 'submittedAt';
    const sortBy = sortByParam === 'date' ? 'submittedAt' : sortByParam;
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const search = searchParams.get('search');
    const includeStats = searchParams.get('includeStats') === 'true';

    // Build filters
    const filters: DreamFilters = {
      page,
      limit,
      sortBy,
      sortOrder
    };
    
    if (gender) filters.gender = gender;
    if (maritalStatus) filters.maritalStatus = maritalStatus;
    if (status) filters.status = status;
    if (search) filters.search = search;

    // Get dreams with filters
    const result = await getDreamsWithFilters(filters);
    
    // Include statistics if requested
    let stats = undefined;
    if (includeStats) {
      stats = await getDreamsCountByStatus();
    }

    return NextResponse.json<ApiResponse<{
      dreams: DreamInterpretation[];
      stats?: typeof stats;
    }>>({
      success: true,
      data: {
        dreams: result.dreams,
        stats
      },
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Error fetching dreams:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch dreams'
    }, { status: 500 });
  }
}

// PUT /api/admin/dreams - Update dream interpretation
export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 });
    }

    const body = await request.json();
    const { id, interpretation, interpretedBy, tags, isPublic } = body;

    // Validation
    if (!id || !interpretation) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Dream ID and interpretation are required'
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

// DELETE /api/admin/dreams - Delete a dream
export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Dream ID is required'
      }, { status: 400 });
    }

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