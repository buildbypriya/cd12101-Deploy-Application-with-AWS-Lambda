import { getUploadUrl } from '../../fileStorage/attachmentUtils.mjs'
import { parseUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization
  const jwtToken = authHeader.split(' ')[1]
  const userId = parseUserId(jwtToken)

  const todoId = event.pathParameters.todoId
  const uploadUrl = await getUploadUrl(userId, todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ uploadUrl })
  }
}
