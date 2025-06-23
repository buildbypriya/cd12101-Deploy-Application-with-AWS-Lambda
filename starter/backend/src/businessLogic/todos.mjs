import { getTodos } from '../dataLayer/todosAccess.mjs';
import { saveTodoItem } from '../dataLayer/todosAccess.mjs';
import { updateTodoItem } from '../dataLayer/todosAccess.mjs';
import { removeTodoItem } from '../dataLayer/todosAccess.mjs'

export async function getTodosForUser(userId) {
  return await getTodos(userId);
}

export async function createTodo(todoItem) {
  return await saveTodoItem(todoItem);
}

export async function updateTodo(userId, todoId, updatedFields) {
  await updateTodoItem(userId, todoId, updatedFields);
}

export async function deleteTodo(userId, todoId) {
  await removeTodoItem(userId, todoId)
}