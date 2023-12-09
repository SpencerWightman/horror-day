import {
  DynamoDBClient,
  QueryCommand
} from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";

// credentials fetched automatically by SDK lookup chain
const dynamoClient = new DynamoDBClient({}); 
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);
const TableName = 'horrify';

// story_id is creation timestamp
export const storeEntry = async (user_id, story_id, story) => {
  const dynamoPut = new PutCommand({
    TableName,
    Item: {
      user_id,
      story_id,
      story
    },
  });

  let response;
  
  try {
    response = await dynamoDocClient.send(dynamoPut);
  } catch (error) {
    console.log('Error pushing to DynamoDB: ', error);
    response = 404;
  }

  return response;
}

// story_id is creation timestamp
export const fetchSingleEntry = async (user_id, story_id) => {
  const dynamoQuery = new QueryCommand({
    TableName,
    KeyConditionExpression: 'user_id = :user_id and story_id = :story_id',
    ExpressionAttributeValues: {
      ':user_id': user_id,
      ':story_id': story_id
    }
  });

  let response;

  try {
    response = await dynamoClient.send(dynamoQuery);
  } catch (error) {
    console.log('Error querying DynamoDB:', error);
    response = 404;
  }

  return response;
}

// story_id is creation timestamp
export const fetchEntriesTimestamps = async (user_id) => {
  const dynamoQuery = new QueryCommand({
    TableName,
    KeyConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': user_id
    },
    ProjectionExpression: 'story_id'
  });

  let storyIds = [];

  try {
    const response = await dynamoDocClient.send(dynamoQuery);
    if (response.Items) {
      storyIds = response.Items.map(item => item.story_id);
    }
  } catch (error) {
    console.log('Error querying DynamoDB:', error);
    return 404;
  }

  return storyIds;
};