import { NextRequest, NextResponse } from 'next/server';
import { getDreamsCountByStatus } from '@/lib/db';
import { ApiResponse, DreamStats } from '@/types';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'kareem-fuad-admin-2024';

// GET /api/admin/stats - Get dream statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (token !== ADMIN_TOKEN) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized access'
      }, { status: 401 });
    }

    const stats = await getDreamsCountByStatus();

    return NextResponse.json<ApiResponse<DreamStats>>({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch statistics'
    }, { status: 500 });
  }
}