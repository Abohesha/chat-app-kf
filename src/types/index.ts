// Dream interpretation data types

export interface DreamInterpretation {
  id: string;
  name: string;
  gender: 'male' | 'female';
  maritalStatus: 'married' | 'single';
  dream: string;
  submittedAt: string;
  ipAddress?: string;
  interpretation?: string;
  interpretedAt?: string;
  interpretedBy?: string;
  status?: 'pending' | 'interpreted' | 'archived';
  tags?: string[];
  isPublic?: boolean;
}

export interface FormData {
  name: string;
  gender: 'male' | 'female';
  maritalStatus: 'married' | 'single';
  dream: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    current: number;
    total: number;
    count: number;
    perPage: number;
  };
}

export interface DreamFilters {
  page?: number;
  limit?: number;
  gender?: 'male' | 'female';
  maritalStatus?: 'single' | 'married';
  status?: 'pending' | 'interpreted' | 'archived';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface DreamStats {
  pending: number;
  interpreted: number;
  archived: number;
  total: number;
}