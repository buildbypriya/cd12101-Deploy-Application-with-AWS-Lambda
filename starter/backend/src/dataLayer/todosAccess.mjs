import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import AWSXRay from 'aws-xray-sdk-core';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

import { createLogger } from '../utils/logger.mjs';
const logger = createLogger('TodosAccess');

const client = AWSXRay.captureAWSv3Client(
    new DynamoDBClient({ region: 'us-east-1' })
);
const docClient = DynamoDBDocumentClient.from(client);

export async function getTodos(userId) {
    try {
        logger.info('Getting todos for user', { userId })

        const result = await docClient.send(
            new QueryCommand({
                TableName: process.env.TODOS_TABLE,
                IndexName: process.env.TODOS_CREATED_AT_INDEX,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
        )
        return result.Items
    } catch (error) {
        logger.error('Failed to get todos', { error: error.message })
        throw error
    }

}

export async function saveTodoItem(todoItem) {
    try {
        logger.info(`Creating todo for user: ${todoItem.userId}`);
        const params = {
            TableName: process.env.TODOS_TABLE,
            Item: todoItem
        };

        await docClient.send(new PutCommand(params));
        return todoItem;
    } catch (error) {
        logger.error(`Failed to create todo for user: ${todoItem.userId}`, { error: error.message });
        throw error;
    }
}

export async function updateTodoItem(userId, todoId, updatedFields) {
    try {
        logger.info(`Updating todo for user: ${userId}`);
        const params = {
            TableName: process.env.TODOS_TABLE,
            Key: { userId, todoId },
            UpdateExpression: 'set #n = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                '#n': 'name'
            },
            ExpressionAttributeValues: {
                ':name': updatedFields.name,
                ':dueDate': updatedFields.dueDate,
                ':done': updatedFields.done
            }
        };

        await docClient.send(new UpdateCommand(params));
    } catch (error) {
        logger.error(`Failed to update todo for user: ${userId}`, { error: error.message });
        throw error;
    }
}

export async function removeTodoItem(userId, todoId) {
    try {
        logger.info(`Deleting todo for user: ${userId}`);
        const params = {
            TableName: process.env.TODOS_TABLE,
            Key: { userId, todoId }
        };

        await docClient.send(new DeleteCommand(params));
    } catch (error) {
        logger.error(`Failed to delete todo for user: ${userId}`, { error: error.message });
        throw error;
    }
}

