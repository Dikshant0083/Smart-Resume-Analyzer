import serverless from 'serverless-http'
import app from '../server/app.js'

const handler = serverless(app)

export default handler
export { handler }
