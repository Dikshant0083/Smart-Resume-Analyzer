// Suggestion engine for generating improvement tips

export const generateSuggestions = (matchResult, extractedData) => {
  const insights = []
  const { score, skillGaps, skillMatches } = matchResult

  // Score-based insights
  if (score >= 80) {
    insights.push({
      type: 'lightbulb',
      title: 'Excellent Match!',
      description: 'Your resume is well-aligned with this job. Consider highlighting your matching skills more prominently.'
    })
  } else if (score >= 60) {
    insights.push({
      type: 'trending',
      title: 'Good Potential',
      description: 'You have a solid foundation. Review the missing skills to improve your chances.'
    })
  } else {
    insights.push({
      type: 'alert',
      title: 'Needs Improvement',
      description: 'Consider updating your resume with the required skills for this position.'
    })
  }

  // Missing skills insights
  const missingSkills = skillGaps.filter(s => s.status === 'missing')
  if (missingSkills.length > 0) {
    insights.push({
      type: 'target',
      title: 'Key Skills to Add',
      description: `Consider adding: ${missingSkills.slice(0, 3).map(s => s.skill).join(', ')}${missingSkills.length > 3 ? ' and more' : ''}`
    })
  }

  // Partial matches
  const partialSkills = skillGaps.filter(s => s.status === 'partial')
  if (partialSkills.length > 0) {
    insights.push({
      type: 'trending',
      title: 'Related Skills Found',
      description: `You have related experience. Consider emphasizing: ${partialSkills.map(s => s.skill).join(', ')}`
    })
  }

  // Strong matches
  const strongMatches = skillMatches.filter(s => s.status === 'matched' && s.score >= 80)
  if (strongMatches.length > 0) {
    insights.push({
      type: 'lightbulb',
      title: 'Your Strengths',
      description: `You match on: ${strongMatches.slice(0, 5).map(s => s.skill).join(', ')}. Make these prominent in your resume.`
    })
  }

  // Resume content insights
  if (extractedData) {
    if (extractedData.skills && extractedData.skills.length < 5) {
      insights.push({
        type: 'alert',
        title: 'Add More Skills',
        description: 'Consider adding more technical skills to make your resume more competitive.'
      })
    }

    if (extractedData.experience && extractedData.experience.length < 2) {
      insights.push({
        type: 'target',
        title: 'Expand Experience Section',
        description: 'Add more detail to your work experience to highlight your achievements.'
      })
    }

    if (extractedData.education && extractedData.education.length === 0) {
      insights.push({
        type: 'alert',
        title: 'Add Education',
        description: 'Consider adding your educational background to strengthen your profile.'
      })
    }
  }

  // Actionable tips
  if (insights.length < 3) {
    insights.push({
      type: 'target',
      title: 'Quick Tips',
      description: 'Use keywords from the job description in your resume. Quantify your achievements where possible.'
    })
  }

  return insights.slice(0, 5) // Limit to 5 insights
}

export default { generateSuggestions }