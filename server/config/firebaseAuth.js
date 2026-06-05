import https from 'https'
import jwt from 'jsonwebtoken'

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'resumeanalyzer-50e48'
const FIREBASE_CERT_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'

let cachedCertificates = null
let certificatesExpiry = 0

const getCacheDuration = (cacheControl = '') => {
  const match = cacheControl.match(/max-age=(\d+)/)
  return match ? Number(match[1]) : 3600
}

const fetchFirebaseCertificates = () => new Promise((resolve, reject) => {
  const request = https.get(FIREBASE_CERT_URL, (response) => {
    let body = ''

    response.setEncoding('utf8')
    response.on('data', (chunk) => {
      body += chunk
    })

    response.on('end', () => {
      if (response.statusCode !== 200) {
        reject(new Error('Failed to fetch Firebase public certificates'))
        return
      }

      try {
        const certificates = JSON.parse(body)
        const maxAge = getCacheDuration(response.headers['cache-control'])

        cachedCertificates = certificates
        certificatesExpiry = Date.now() + (maxAge * 1000)

        resolve(certificates)
      } catch (error) {
        reject(new Error('Failed to parse Firebase public certificates'))
      }
    })
  })

  request.on('error', () => {
    reject(new Error('Unable to fetch Firebase public certificates'))
  })
})

const getFirebaseCertificates = async () => {
  if (cachedCertificates && Date.now() < certificatesExpiry) {
    return cachedCertificates
  }

  return fetchFirebaseCertificates()
}

export const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Firebase ID token is required')
  }

  const decodedToken = jwt.decode(idToken, { complete: true })

  if (!decodedToken?.header?.kid) {
    throw new Error('Invalid Firebase token header')
  }

  let certificates = await getFirebaseCertificates()
  let certificate = certificates[decodedToken.header.kid]

  if (!certificate) {
    cachedCertificates = null
    certificates = await getFirebaseCertificates()
    certificate = certificates[decodedToken.header.kid]
  }

  if (!certificate) {
    throw new Error('No Firebase certificate found for the provided token')
  }

  return jwt.verify(idToken, certificate, {
    algorithms: ['RS256'],
    audience: FIREBASE_PROJECT_ID,
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
  })
}
