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
const StoryTableName = 'horrify-stories';
const UserTableName = 'horrify-users';
const saltRounds = 5;

// store new user
export const storeUser = async (user_id, password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const dynamoPut = new PutCommand({
    TableName: UserTableName,
    Item: {
      user_id,
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
export const validateLogin = async (user_id, pass) => {
  const dynamoQuery = new QueryCommand({
    TableName: UserTableName,
    KeyConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': { 'S': user_id }
    }
  });

  try {
    const response = await dynamoDocClient.send(dynamoQuery);
    if (response.Items && response.Items.length > 0) {
      const user = response.Items[0];
      const isPasswordValid = await bcrypt.compare(pass, user.hashedPassword.S);
      if (isPasswordValid) {
        return 'valid password';
      } else {
        return 'wrong password';
      }
    } else {
      return 'no username';
    }
  } catch (error) {
    console.error('Error validating login DynamoDB: ', error);
    return 'no username';
  }
};

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
export const fetchSingleEntry = async (userId, stringId) => {
  const dynamoQuery = new QueryCommand({
    TableName: StoryTableName,
    KeyConditionExpression: 'user_id = :user_id and story_id = :story_id',
    ExpressionAttributeValues: {
      ':user_id': { 'S': userId },
      ':story_id': { 'N': stringId }
    }
  });

  try {
    const response = await dynamoClient.send(dynamoQuery);
    return response.Items[0].story.S;
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
      ':user_id': { 'S': user_id }
    },
    ProjectionExpression: 'story_id'
  });

  let storyIds = [];

  try {
    const response = await dynamoClient.send(dynamoQuery);
    if (response.Items) {
      storyIds = response.Items.map(item => item.story_id);
    }
  } catch (error) {
    console.error('Error querying DynamoDB:', error);
    return { status: 'error', message: error.message };
  }

  return storyIds;
};