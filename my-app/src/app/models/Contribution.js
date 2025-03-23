import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  type: {
    type: String,
    enum: ['Tree Planting', 'Beach Cleanup', 'Wildlife Conservation', 'Other'],
    required: true,
  },
  metrics: {
    treesPlanted: {
      type: Number,
      default: 0,
    },
    hoursContributed: {
      type: Number,
      required: true,
    },
    areaCleanedSqM: {
      type: Number,
      default: 0,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for efficient querying
contributionSchema.index({ user: 1, date: -1 });
contributionSchema.index({ event: 1 });

const Contribution = mongoose.models.Contribution || mongoose.model('Contribution', contributionSchema);

export default Contribution; 