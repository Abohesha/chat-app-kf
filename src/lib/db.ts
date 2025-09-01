import connectDB from './mongodb';
import Dream, { IDream } from '@/models/Dream';
import { DreamInterpretation } from '@/types';
import mongoose from 'mongoose';

// Ensure database connection
async function ensureConnection() {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Database connection failed');
  }
}

// Convert MongoDB document to API format
function formatDreamForAPI(dream: IDream): DreamInterpretation {
  return {
    id: dream._id.toString(),
    name: dream.name,
    gender: dream.gender,
    maritalStatus: dream.maritalStatus,
    dream: dream.dream,
    ipAddress: dream.ipAddress,
    submittedAt: dream.submittedAt.toISOString(),
    interpretation: dream.interpretation,
    interpretedAt: dream.interpretedAt?.toISOString(),
    interpretedBy: dream.interpretedBy,
    status: dream.status,
    tags: dream.tags,
    isPublic: dream.isPublic
  };
}

// Read all dreams from MongoDB
export async function getAllDreams(): Promise<DreamInterpretation[]> {
  try {
    await ensureConnection();
    const dreams = await Dream.find({})
      .sort({ submittedAt: -1 })
      .lean()
      .exec();
    
    return dreams.map(dream => formatDreamForAPI(dream as IDream));
  } catch (error) {
    console.error('Error reading dreams:', error);
    throw new Error('Failed to fetch dreams');
  }
}

// Get dreams with advanced filtering and pagination
export async function getDreamsWithFilters({
  page = 1,
  limit = 10,
  gender,
  maritalStatus,
  status,
  sortBy = 'submittedAt',
  sortOrder = 'desc' as 'asc' | 'desc',
  search
}: {
  page?: number;
  limit?: number;
  gender?: 'male' | 'female';
  maritalStatus?: 'single' | 'married';
  status?: 'pending' | 'interpreted' | 'archived';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
} = {}) {
  try {
    await ensureConnection();
    
    // Build filters
    const mongoFilters: Record<string, unknown> = {};
    if (gender) mongoFilters.gender = gender;
    if (maritalStatus) mongoFilters.maritalStatus = maritalStatus;
    if (status) mongoFilters.status = status;
    
    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      mongoFilters.$or = [
        { name: searchRegex },
        { dream: searchRegex },
        { interpretation: searchRegex }
      ];
    }
    
    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const [dreams, total] = await Promise.all([
      Dream.find(mongoFilters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Dream.countDocuments(mongoFilters).exec()
    ]);
    
    return {
      dreams: dreams.map(dream => formatDreamForAPI(dream as IDream)),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        perPage: limit
      }
    };
  } catch (error) {
    console.error('Error filtering dreams:', error);
    throw new Error('Failed to filter dreams');
  }
}

// Save a new dream interpretation
export async function saveDream(dreamData: {
  name: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married';
  dream: string;
  ipAddress?: string;
}): Promise<DreamInterpretation> {
  try {
    await ensureConnection();
    
    const newDream = new Dream({
      name: dreamData.name.trim(),
      gender: dreamData.gender,
      maritalStatus: dreamData.maritalStatus,
      dream: dreamData.dream.trim(),
      ipAddress: dreamData.ipAddress || 'unknown',
      submittedAt: new Date(),
      status: 'pending',
      isPublic: false
    });
    
    const savedDream = await newDream.save();
    return formatDreamForAPI(savedDream);
  } catch (error) {
    console.error('Error saving dream:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    throw new Error('Failed to save dream');
  }
}

// Get dream by ID
export async function getDreamById(id: string): Promise<DreamInterpretation | null> {
  try {
    await ensureConnection();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    
    const dream = await Dream.findById(id).lean().exec();
    return dream ? formatDreamForAPI(dream as IDream) : null;
  } catch (error) {
    console.error('Error getting dream by ID:', error);
    throw new Error('Failed to fetch dream');
  }
}

// Update dream interpretation
export async function updateDreamInterpretation({
  id,
  interpretation,
  interpretedBy = 'Kareem Fuad',
  tags = [],
  isPublic = false
}: {
  id: string;
  interpretation: string;
  interpretedBy?: string;
  tags?: string[];
  isPublic?: boolean;
}): Promise<DreamInterpretation | null> {
  try {
    await ensureConnection();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid dream ID');
    }
    
    const updatedDream = await Dream.findByIdAndUpdate(
      id,
      {
        interpretation: interpretation.trim(),
        interpretedBy,
        interpretedAt: new Date(),
        status: 'interpreted',
        tags,
        isPublic
      },
      { new: true, runValidators: true }
    ).lean().exec();
    
    return updatedDream ? formatDreamForAPI(updatedDream as IDream) : null;
  } catch (error) {
    console.error('Error updating dream interpretation:', error);
    throw new Error('Failed to update dream interpretation');
  }
}

// Delete dream
export async function deleteDream(id: string): Promise<boolean> {
  try {
    await ensureConnection();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    
    const result = await Dream.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error) {
    console.error('Error deleting dream:', error);
    throw new Error('Failed to delete dream');
  }
}

// Get dreams count
export async function getDreamsCount(): Promise<number> {
  try {
    await ensureConnection();
    return await Dream.countDocuments({}).exec();
  } catch (error) {
    console.error('Error getting dreams count:', error);
    return 0;
  }
}

// Get dreams count by status
export async function getDreamsCountByStatus(): Promise<{
  pending: number;
  interpreted: number;
  archived: number;
  total: number;
}> {
  try {
    await ensureConnection();
    
    const [pending, interpreted, archived, total] = await Promise.all([
      Dream.countDocuments({ status: 'pending' }).exec(),
      Dream.countDocuments({ status: 'interpreted' }).exec(),
      Dream.countDocuments({ status: 'archived' }).exec(),
      Dream.countDocuments({}).exec()
    ]);
    
    return { pending, interpreted, archived, total };
  } catch (error) {
    console.error('Error getting dreams count by status:', error);
    return { pending: 0, interpreted: 0, archived: 0, total: 0 };
  }
}

// Get public dreams for display
export async function getPublicDreams(): Promise<DreamInterpretation[]> {
  try {
    await ensureConnection();
    
    const dreams = await Dream.find({ 
      isPublic: true, 
      status: 'interpreted' 
    })
    .sort({ interpretedAt: -1 })
    .select('-ipAddress') // Don't include IP addresses in public view
    .lean()
    .exec();
    
    return dreams.map(dream => formatDreamForAPI(dream as IDream));
  } catch (error) {
    console.error('Error getting public dreams:', error);
    throw new Error('Failed to fetch public dreams');
  }
}