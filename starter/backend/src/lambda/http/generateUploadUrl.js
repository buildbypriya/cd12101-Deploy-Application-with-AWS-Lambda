import { getUploadUrl, getAttachmentUrl } from '../../fileStorage/attachmentUtils.mjs';
import { parseUserId } from '../../auth/utils.mjs';
import { updateAttachmentUrl } from '../../dataLayer/todosAccess.mjs';

export const handler = async (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization
  const jwtToken = authHeader.split(' ')[1]
  const userId = parseUserId(jwtToken)

  const todoId = event.pathParameters.todoId


  try {
    const uploadUrl = await getUploadUrl(userId, todoId);
    const attachmentUrl = getAttachmentUrl(userId, todoId);

    await updateAttachmentUrl(userId, todoId, attachmentUrl);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ uploadUrl })
    };
  } catch (error) {
    console.error('Error in GenerateUploadUrl handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not generate upload URL', errorMessage: error})
    };
  }
}
