import mongoose from 'mongoose'

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    default: ''
  },
  matchScore: {
    type: Number,
    default: 0
  },
  skillMatches: [{
    skill: String,
    score: Number,
    status: {
      type: String,
      enum: ['matched', 'missing', 'partial']
    }
  }],
  skillGaps: [{
    skill: String,
    status: {
      type: String,
      enum: ['matched', 'missing', 'partial']
    },
    message: String
  }],
  insights: [{
    type: {
      type: String,
      enum: ['lightbulb', 'trending', 'alert', 'target']
    },
    title: String,
    description: String
  }],
  extractedResumeData: {
    skills: [String],
    education: [String],
    experience: [String]
  }
}, {
  timestamps: true
})

const Analysis = mongoose.model('Analysis', analysisSchema)

export default Analysis