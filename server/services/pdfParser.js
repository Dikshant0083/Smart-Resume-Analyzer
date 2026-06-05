import fs from 'fs'
import pdf from 'pdf-parse'
import axios from 'axios'

export const extractTextFromPDF = async (source) => {
  try {
    let dataBuffer

    if (Buffer.isBuffer(source)) {
      dataBuffer = source
    } else if (typeof source === 'string') {
      if (source.startsWith('http')) {
        const response = await axios.get(source, { responseType: 'arraybuffer' })
        dataBuffer = Buffer.from(response.data)
      } else {
        dataBuffer = fs.readFileSync(source)
      }
    } else {
      throw new Error('Unsupported PDF source type')
    }

    const data = await pdf(dataBuffer)
    return data.text
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

export default { extractTextFromPDF }