import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for the Dream document
export interface IDream extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married';
  dream: string;
  ipAddress?: string;
  submittedAt: Date;
  interpretation?: string;
  interpretedAt?: Date;
  interpretedBy?: string;
  status: 'pending' | 'interpreted' | 'archived';
  tags?: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Dream Schema
const DreamSchema: Schema<IDream> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female'],
      message: 'Gender must be either male or female'
    }
  },
  maritalStatus: {
    type: String,
    required: [true, 'Marital status is required'],
    enum: {
      values: ['single', 'married'],
      message: 'Marital status must be either single or married'
    }
  },
  dream: {
    type: String,
    required: [true, 'Dream description is required'],
    trim: true,
    minlength: [10, 'Dream description must be at least 10 characters'],
    maxlength: [5000, 'Dream description cannot exceed 5000 characters']
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  interpretation: {
    type: String,
    trim: true,
    maxlength: [10000, 'Interpretation cannot exceed 10000 characters']
  },
  interpretedAt: {
    type: Date
  },
  interpretedBy: {
    type: String,
    trim: true,
    maxlength: [100, 'Interpreter name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'interpreted', 'archived'],
      message: 'Status must be pending, interpreted, or archived'
    },
    default: 'pending',
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'dreams'
});

// Indexes for better query performance
DreamSchema.index({ submittedAt: -1 });
DreamSchema.index({ status: 1, submittedAt: -1 });
DreamSchema.index({ gender: 1, maritalStatus: 1 });
DreamSchema.index({ isPublic: 1, status: 1 });

// Virtual for dream ID (for backward compatibility)
DreamSchema.virtual('id').get(function(this: IDream) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised
DreamSchema.set('toJSON', {
  virtuals: true,
  transform: function(_doc, ret) {
    const { _id, __v, ...rest } = ret;
    // Remove _id and __v from the returned object
    void _id; // Mark as used to avoid lint warning
    void __v; // Mark as used to avoid lint warning
    return rest;
  }
});

// Static methods
DreamSchema.statics = {
  // Get dreams with pagination
  async getPaginated(
    page: number = 1, 
    limit: number = 10, 
    filters: Record<string, unknown> = {},
    sortBy: string = 'submittedAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const query = this.find(filters);
    const [dreams, total] = await Promise.all([
      query.sort(sort).skip(skip).limit(limit).exec(),
      this.countDocuments(filters).exec()
    ]);

    return {
      dreams,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        perPage: limit
      }
    };
  },

  // Get dreams by status
  async getByStatus(status: 'pending' | 'interpreted' | 'archived') {
    return this.find({ status }).sort({ submittedAt: -1 }).exec();
  },

  // Get public dreams
  async getPublicDreams() {
    return this.find({ isPublic: true, status: 'interpreted' })
      .sort({ interpretedAt: -1 })
      .select('-ipAddress')
      .exec();
  },

  // Search dreams
  async searchDreams(query: string, searchFilters: Record<string, unknown> = {}) {
    const searchRegex = new RegExp(query, 'i');
    const filters = {
      ...searchFilters,
      $or: [
        { name: searchRegex },
        { dream: searchRegex },
        { interpretation: searchRegex },
        { tags: { $in: [searchRegex] } }
      ]
    };

    return this.find(filters).sort({ submittedAt: -1 }).exec();
  }
};

// Instance methods
DreamSchema.methods = {
  // Add interpretation
  async addInterpretation(interpretation: string, interpretedBy: string = 'Kareem Fuad') {
    this.interpretation = interpretation;
    this.interpretedBy = interpretedBy;
    this.interpretedAt = new Date();
    this.status = 'interpreted';
    return this.save();
  },

  // Toggle public status
  async togglePublic() {
    this.isPublic = !this.isPublic;
    return this.save();
  },

  // Add tags
  async addTags(newTags: string[]) {
    if (!this.tags) this.tags = [];
    const uniqueTags = [...new Set([...this.tags, ...newTags])];
    this.tags = uniqueTags;
    return this.save();
  }
};

// Create and export the model
const Dream: Model<IDream> = mongoose.models.Dream || mongoose.model<IDream>('Dream', DreamSchema);

export default Dream;