// TF-IDF based matching engine with weighted bonus scoring

import { SKILL_CATEGORIES, extractSkills, extractSkillsByCategory } from './nlpExtractor.js'

// Tokenize text into words
const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
}

// Calculate term frequency
const calculateTF = (tokens) => {
  const tf = {}
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1
  }
  // Normalize by total tokens
  const total = tokens.length
  for (const token in tf) {
    tf[token] = tf[token] / total
  }
  return tf
}

// Calculate document frequency across corpus
const calculateDF = (documents) => {
  const df = {}
  for (const doc of documents) {
    const uniqueTokens = new Set(tokenize(doc))
    for (const token of uniqueTokens) {
      df[token] = (df[token] || 0) + 1
    }
  }
  return df
}

// Calculate IDF for all tokens
const calculateIDF = (df, totalDocs) => {
  const idf = {}
  for (const token in df) {
    idf[token] = Math.log(totalDocs / df[token]) + 1
  }
  return idf
}

// Calculate TF-IDF vector
const calculateTFIDF = (tokens, idf) => {
  const tf = calculateTF(tokens)
  const tfidf = {}
  for (const token in tf) {
    tfidf[token] = tf[token] * (idf[token] || 1)
  }
  return tfidf
}

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vec1, vec2) => {
  const keys = new Set([...Object.keys(vec1), ...Object.keys(vec2)])
  
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0

  for (const key of keys) {
    const val1 = vec1[key] || 0
    const val2 = vec2[key] || 0
    dotProduct += val1 * val2
    norm1 += val1 * val1
    norm2 += val2 * val2
  }

  if (norm1 === 0 || norm2 === 0) return 0

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
}

// Skill weights by category (higher = more important for job matching)
const SKILL_WEIGHTS = {
  languages: 1.0,        // Programming languages are core
  frontend: 0.9,         // Frontend skills
  backend: 1.0,          // Backend skills are core
  databases: 0.85,       // Database skills
  cloudDevops: 0.95,     // Cloud/DevOps increasingly important
  dataML: 0.9,           // Data/ML skills are valuable
  testing: 0.8,          // Testing skills
  security: 0.85,        // Security skills
  tools: 0.7,            // Tools are less critical
  softSkills: 0.6,       // Soft skills weighted lower for technical matching
  methodologies: 0.75,   // Methodologies
  bigData: 0.9,          // Big data skills
  mobile: 0.85,          // Mobile development
  apiIntegration: 0.9    // API skills
}

// Related skills mapping for partial matching
const RELATED_SKILLS = {
  'react': ['vue', 'angular', 'svelte', 'preact'],
  'angular': ['vue', 'react', 'svelte'],
  'vue': ['react', 'angular', 'svelte'],
  'node': ['express', 'koa', 'fastify', 'nest'],
  'express': ['koa', 'fastify', 'hapi'],
  'python': ['django', 'flask', 'fastapi', 'pyramid'],
  'django': ['flask', 'fastapi', 'pyramid'],
  'flask': ['django', 'fastapi', 'bottle'],
  'java': ['spring', 'jakarta', 'quarkus', 'micronaut'],
  'spring': ['quarkus', 'micronaut', 'play'],
  'sql': ['mysql', 'postgresql', 'mariadb', 'sqlite'],
  'mysql': ['postgresql', 'mariadb', 'sqlite'],
  'postgresql': ['mysql', 'mariadb', 'sqlite'],
  'mongodb': ['couchdb', 'cassandra', 'dynamodb'],
  'redis': ['memcached', 'couchbase'],
  'aws': ['azure', 'gcp', 'google cloud'],
  'azure': ['aws', 'gcp', 'google cloud'],
  'gcp': ['aws', 'azure', 'google cloud'],
  'docker': ['podman', 'containerd', 'lxc'],
  'kubernetes': ['openshift', 'rancher', 'nomad'],
  'tensorflow': ['pytorch', 'keras', 'mxnet'],
  'pytorch': ['tensorflow', 'keras', 'mxnet'],
  'jest': ['mocha', 'jasmine', 'vitest'],
  'cypress': ['playwright', 'puppeteer', 'selenium'],
  'selenium': ['playwright', 'puppeteer', 'cypress'],
  'git': ['svn', 'mercurial', 'perforce'],
  'graphql': ['rest', 'grpc', 'odata'],
  'rest': ['graphql', 'grpc', 'soap'],
  'ios': ['android', 'react native', 'flutter'],
  'android': ['ios', 'react native', 'flutter'],
  'react native': ['flutter', 'xamarin', 'ionic'],
  'flutter': ['react native', 'xamarin', 'ionic']
}

// Extract skills from job description using comprehensive dictionary
const extractJobSkills = (jobDescription) => {
  // Use NLP extractor's comprehensive skills extraction
  const skillsByCategory = extractSkillsByCategory(jobDescription)
  
  // Flatten and weight skills
  const weightedSkills = []
  
  for (const [category, skills] of Object.entries(skillsByCategory)) {
    const weight = SKILL_WEIGHTS[category] || 0.8
    for (const skill of skills) {
      weightedSkills.push({
        skill,
        category,
        weight
      })
    }
  }
  
  // Remove duplicates while preserving order
  const seen = new Set()
  const uniqueSkills = []
  for (const item of weightedSkills) {
    const key = item.skill.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      uniqueSkills.push(item)
    }
  }
  
  return uniqueSkills
}

// Check for related skills (partial matching)
const findRelatedSkill = (jobSkill, resumeSkills) => {
  const jobSkillLower = jobSkill.toLowerCase()
  
  // Check direct related skills
  const related = RELATED_SKILLS[jobSkillLower] || []
  for (const rel of related) {
    const found = resumeSkills.find(s => s.toLowerCase().includes(rel))
    if (found) return found
  }
  
  // Check if any resume skill contains the job skill
  for (const resumeSkill of resumeSkills) {
    const resumeLower = resumeSkill.toLowerCase()
    if (resumeLower.includes(jobSkillLower) || jobSkillLower.includes(resumeLower)) {
      if (resumeLower !== jobSkillLower) return resumeSkill
    }
  }
  
  return null
}

// Main matching function with weighted bonus scoring
export const matchResumeToJob = (resumeText, jobDescription, extractedSkills = []) => {
  // Tokenize texts
  const resumeTokens = tokenize(resumeText)
  const jobTokens = tokenize(jobDescription)

  // Create corpus for IDF calculation
  const corpus = [resumeText, jobDescription]
  const df = calculateDF(corpus)
  const idf = calculateIDF(df, corpus.length)

  // Calculate TF-IDF vectors
  const resumeTFIDF = calculateTFIDF(resumeTokens, idf)
  const jobTFIDF = calculateTFIDF(jobTokens, idf)

  // Calculate base similarity score
  const baseScore = cosineSimilarity(resumeTFIDF, jobTFIDF) * 100

  // Extract job skills with weights
  const jobSkills = extractJobSkills(jobDescription)
  
  // Combine with extracted resume skills
  const resumeSkills = [...new Set([...extractedSkills, ...resumeTokens])]

  // Calculate skill match scores with weights
  const skillMatches = []
  const skillGaps = []
  
  let totalWeight = 0
  let matchedWeight = 0

  for (const jobSkill of jobSkills) {
    totalWeight += jobSkill.weight
    
    const foundInResume = resumeSkills.some(s => 
      s.toLowerCase().includes(jobSkill.skill.toLowerCase())
    )

    if (foundInResume) {
      matchedWeight += jobSkill.weight
      skillMatches.push({
        name: jobSkill.skill,
        skill: jobSkill.skill,
        category: jobSkill.category,
        score: 100,
        status: 'matched',
        weight: jobSkill.weight
      })
    } else {
      // Check for partial matches (related skills)
      const partialMatch = findRelatedSkill(jobSkill.skill, resumeSkills)

      if (partialMatch) {
        const partialWeight = jobSkill.weight * 0.5 // 50% credit for related skills
        matchedWeight += partialWeight
        skillMatches.push({
          name: jobSkill.skill,
          skill: jobSkill.skill,
          relatedSkill: partialMatch,
          category: jobSkill.category,
          score: 50,
          status: 'partial',
          weight: partialWeight
        })
        skillGaps.push({
          skill: jobSkill.skill,
          relatedSkill: partialMatch,
          status: 'partial',
          category: jobSkill.category,
          message: `Consider learning ${jobSkill.skill} (you have: ${partialMatch})`
        })
      } else {
        skillGaps.push({
          skill: jobSkill.skill,
          status: 'missing',
          category: jobSkill.category,
          message: `Add ${jobSkill.skill} to your skill set`
        })
      }
    }
  }

  // Calculate weighted skill match percentage
  const skillMatchPercentage = totalWeight > 0 
    ? (matchedWeight / totalWeight) * 100 
    : 0

  // Bonus scoring for high-demand skills
  let bonusScore = 0
  
  // Check for critical skills that add bonus points
  const criticalSkills = ['react', 'node', 'python', 'aws', 'docker', 'kubernetes', 'typescript']
  const foundCritical = skillMatches.filter(s => 
    criticalSkills.includes(s.skill.toLowerCase())
  ).length
  
  if (foundCritical > 0) {
    bonusScore = Math.min(10, foundCritical * 2) // Up to 10 bonus points
  }

  // Education/Experience bonus
  const hasEducation = extractedSkills.some(s => 
    ['bachelor', 'master', 'phd', 'degree', 'certification'].includes(s.toLowerCase())
  )
  if (hasEducation) bonusScore += 5

  // Weighted final score with bonuses
  const finalScore = Math.round(
    (baseScore * 0.35) + (skillMatchPercentage * 0.55) + bonusScore
  )

  return {
    score: Math.min(100, Math.max(0, finalScore)),
    skillMatches,
    skillGaps,
    breakdown: {
      baseScore: Math.round(baseScore),
      skillMatchPercentage: Math.round(skillMatchPercentage),
      bonusScore,
      totalWeight,
      matchedWeight
    }
  }
}

export default { matchResumeToJob }