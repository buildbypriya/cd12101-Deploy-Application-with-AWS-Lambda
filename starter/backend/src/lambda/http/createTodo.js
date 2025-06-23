import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createTodo } from '../../businessLogic/todos.mjs';
import { parseUserId } from '../../auth/utils.mjs';
import { v4 as uuidv4 } from 'uuid';

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

  const newTodoData = JSON.parse(event.body);
  const todoId = uuidv4()
  const createdAt = new Date().toISOString()

  const newTodo = {
    userId,
    todoId,
    createdAt,
    name: newTodoData.name,
    dueDate: newTodoData.dueDate,
    done: false
  }

  const savedItem = await createTodo(newTodo)

  console.log(JSON.stringify({
    _aws: {
      Timestamp: Date.now(),
      CloudWatchMetrics: [
        {
          Namespace: 'TodosApp',
          Dimensions: [['FunctionName']],
          Metrics: [{ Name: 'TodosCreated', Unit: 'Count' }]
        }
      ]
    },
    FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME || 'CreateTodo',
    TodosCreated: 1
  }));

  return {
    statusCode: 201,
    body: JSON.stringify({ item: savedItem })
  }
})
