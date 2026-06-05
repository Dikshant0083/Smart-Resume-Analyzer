import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    default: ''
  },
  fileSize: {
    type: Number,
    default: 0
  },
  textContent: {
    type: String,
    default: ''
  },
  resumeTitle: {
    type: String,
    default: ''
  },
  template: {
    type: String,
    default: 'modern'
  },
  resumeData: {
    personal: {
      fullName: String,
      title: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String,
    },
    summary: String,
    skills: [String],
    education: [
      {
        school: String,
        degree: String,
        dates: String,
        details: String,
      }
    ],
    experience: [
      {
        company: String,
        role: String,
        dates: String,
        location: String,
        details: String,
      }
    ],
    projects: [
      {
        name: String,
        description: String,
        link: String,
      }
    ]
  },
  extractedData: {
    skills: [String],
    education: [String],
    experience: [String],
    contactInfo: {
      email: String,
      phone: String,
      location: String
    }
  },
  analysisCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Resume = mongoose.model('Resume', resumeSchema)

export default Resume