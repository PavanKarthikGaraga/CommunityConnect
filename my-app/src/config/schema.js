import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Define the Organization sub-schema
const organizationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  type: {
    type: String,
    enum: ['NGO', 'Government'],
    required: true
  },
  department: {
    type: String,
    // Only required if type is Government
    required: function() { 
      return this.type === 'Government';
    }
  },
  registrationNumber: String,
  address: String,
  state: String,
  district: String
});

// Project Schema
const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Education', 'Healthcare', 'Environment', 'Social Welfare', 'Other']
  },
  requiredVolunteers: {
    type: Number,
    required: true
  },
  assignedVolunteers: [{
    volunteer: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Withdrawn'],
      default: 'Active'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Task Schema
const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['Available', 'In Progress', 'Completed', 'Verified'],
    default: 'Available'
  },
  estimatedHours: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Feedback Schema
const feedbackSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task'
  },
  type: {
    type: String,
    enum: ['Question', 'Issue', 'Suggestion', 'Other'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
    default: 'Pending'
  },
  response: {
    message: String,
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Hours Log Schema
const hoursLogSchema = new Schema({
  volunteer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Main User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['Volunteer', 'NGO', 'Government', 'Admin'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Suspended'],
    default: 'Active'
  },
  organization: organizationSchema,
  representativeName: String,
  profileImage: String,
  phone: String,
  skills: [String],
  interests: [String],
  totalHours: {
    type: Number,
    default: 0
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: Date
  }],
  lastActive: {
    type: Date,
    default: Date.now
  },
  resetToken: String,
  resetTokenExpiry: Date,
}, {
  timestamps: true
});

// Create and export models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
export const HoursLog = mongoose.models.HoursLog || mongoose.model('HoursLog', hoursLogSchema);