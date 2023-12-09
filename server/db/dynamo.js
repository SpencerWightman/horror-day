import {
  DynamoDBClient,
  QueryCommand
} from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
import bcrypt from 'bcrypt';

// credentials fetched automatically by SDK lookup chain
const dynamoClient = new DynamoDBClient({}); 
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);
const StoryTableName = 'horrify';
const UserTableName = 'horrify-users';
const saltRounds = 5;

// store new user
export const storeUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const dynamoPut = new PutCommand({
    TableName: UserTableName,
    Item: {
      username,
      hashedPassword
    },
  });

  try {
    await dynamoDocClient.send(dynamoPut);
    return { status: 'success' };
  } catch (error) {
    console.error('Error pushing to DynamoDB: ', error);
    return { status: 'error', message: error.message };
  }
};

// validate login
export const validateLogin = async (username, pass) => {

}

// check username taken
export const validateSignup = async (username, pass) => {

}

// story_id is creation timestamp
export const storeEntry = async (user_id, story_id, story) => {
  const dynamoPut = new PutCommand({
    TableName: StoryTableName,
    Item: {
      user_id,
      story_id,
      story
    },
  });
  
  try {
    await dynamoDocClient.send(dynamoPut);
    return { status: 'success' };
  } catch (error) {
    console.error('Error pushing to DynamoDB: ', error);
    return { status: 'error', message: error.message };
  }
}

// story_id is creation timestamp
export const fetchSingleEntry = async (user_id, story_id) => {
  const dynamoQuery = new QueryCommand({
    TableName: StoryTableName,
    KeyConditionExpression: 'user_id = :user_id and story_id = :story_id',
    ExpressionAttributeValues: {
      ':user_id': user_id,
      ':story_id': story_id
    }
  });

  try {
    await dynamoClient.send(dynamoQuery);
    return { status: 'success' };
  } catch (error) {
    console.error('Error fetching from DynamoDB: ', error);
    return { status: 'error', message: error.message };
  }
}

// story_id is creation timestamp
export const fetchEntriesTimestamps = async (user_id) => {
  const dynamoQuery = new QueryCommand({
    TableName: StoryTableName,
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
    console.error('Error querying DynamoDB:', error);
    return { status: 'error', message: error.message };
  }

  return storyIds;
};