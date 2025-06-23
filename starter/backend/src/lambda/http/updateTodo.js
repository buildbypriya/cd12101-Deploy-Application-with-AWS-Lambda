import { updateTodo } from '../../businessLogic/todos.mjs'
import { parseUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization
  const jwtToken = authHeader.split(' ')[1]
  const userId = parseUserId(jwtToken)

  const todoId = event.pathParameters.todoId
  const updatedFields = JSON.parse(event.body)

  await updateTodo(userId, todoId, updatedFields)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
