import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodosForUser } from '../../businessLogic/todos.mjs'
import { parseUserId } from '../../auth/utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization
  const jwtToken = authHeader.split(' ')[1]
  const userId = parseUserId(jwtToken)

  const todos = await getTodosForUser(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({ items: todos })
  }
})
