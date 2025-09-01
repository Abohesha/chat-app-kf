import { NextRequest, NextResponse } from 'next/server';
import { saveDream, getDreamsWithFilters } from '@/lib/db';
import { FormData, ApiResponse, DreamInterpretation } from '@/types';
import rateLimit from '@/lib/rate-limit';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Allow 500 unique tokens per interval
});

// GET /api/dreams - Fetch dreams with filters (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    // Verify admin token
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 });
    }

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Max 100 per page
    const gender = searchParams.get('gender') as 'male' | 'female' | null;
    const maritalStatus = searchParams.get('maritalStatus') as 'single' | 'married' | null;
    const status = searchParams.get('status') as 'pending' | 'interpreted' | 'archived' | null;
    const sortBy = searchParams.get('sortBy') || 'submittedAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const search = searchParams.get('search');

    // Build filters object
    const filters: {
      gender?: 'male' | 'female';
      maritalStatus?: 'single' | 'married';
      status?: 'pending' | 'interpreted' | 'archived';
    } = {};
    if (gender) filters.gender = gender;
    if (maritalStatus) filters.maritalStatus = maritalStatus;
    if (status) filters.status = status;

    const result = await getDreamsWithFilters({
      page,
      limit,
      ...filters,
      sortBy,
      sortOrder,
      search: search || undefined
    });

    return NextResponse.json<ApiResponse<typeof result>>({
      success: true,
      data: result,
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

// POST /api/dreams - Submit a new dream
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const identifier = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'anonymous';
    
    try {
      await limiter.check(10, identifier); // 10 requests per minute per IP
    } catch {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Too many requests. Please wait before submitting another dream.'
      }, { status: 429 });
    }

    const body: FormData = await request.json();
    
    // Enhanced validation
    const errors: string[] = [];
    
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!body.gender || !['male', 'female'].includes(body.gender)) {
      errors.push('Gender must be either male or female');
    }
    
    if (!body.maritalStatus || !['single', 'married'].includes(body.maritalStatus)) {
      errors.push('Marital status must be either single or married');
    }
    
    if (!body.dream || typeof body.dream !== 'string' || body.dream.trim().length < 10) {
      errors.push('Dream description must be at least 10 characters long');
    }
    
    if (body.dream && body.dream.length > 5000) {
      errors.push('Dream description cannot exceed 5000 characters');
    }

    // Check for inappropriate content (basic)
    const inappropriateWords = ['spam', 'test', 'fake'];
    const dreamText = body.dream.toLowerCase();
    if (inappropriateWords.some(word => dreamText.includes(word))) {
      errors.push('Please provide a genuine dream description');
    }

    if (errors.length > 0) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: errors.join(', ')
      }, { status: 400 });
    }

    // Get client IP for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Save dream interpretation
    const savedDream = await saveDream({
      name: body.name.trim(),
      gender: body.gender,
      maritalStatus: body.maritalStatus,
      dream: body.dream.trim(),
      ipAddress
    });

    return NextResponse.json<ApiResponse<DreamInterpretation>>({
      success: true,
      data: savedDream
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting dream:', error);
    
    // Handle specific error types
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to submit dream interpretation'
    }, { status: 500 });
  }
}