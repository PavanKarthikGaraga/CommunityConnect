import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Environmental', 'Social', 'Leadership', 'Special'],
    required: true,
  },
  criteria: {
    type: {
      type: String,
      enum: ['events_attended', 'trees_planted', 'volunteer_hours', 'special'],
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userAchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true,
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  },
});

const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);
const UserAchievement = mongoose.models.UserAchievement || mongoose.model('UserAchievement', userAchievementSchema);

export { Achievement, UserAchievement }; 