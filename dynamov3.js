const {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');
const AWS = require('aws-sdk');

const credentials = new AWS.Credentials({
    accessKeyId: 'AKIA22YVKXCC7KOQFIHQ',
    secretAccessKey: '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',
  });

const ddbClient = new DynamoDBClient({ 
    region: 'us-east-1',
    credentials: credentials,
 })
const TABLE_NAME = 'User3';

const getTableRowV3 = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: { S: id },
        }
    };
    const tableRow = await ddbClient.send(new GetItemCommand(params))
    console.log('tableRow: ', tableRow)
    return tableRow;
}

const addUserToDBV3 = async (firstName, lastName, id, phoneNumber, password) => {
    const item = {
        "firstName": {"S": firstName},
        "lastName": {"S": lastName},
        "id": {"S": id},
        "phoneNumber": {"S": phoneNumber},
        "password": {"S": password},
    }
    const commandParams = {
        TableName: TABLE_NAME,
        Item: item,
    };

    const responpse = await ddbClient.send(new PutItemCommand(commandParams))    
    
    return responpse
}

const updateUserV3 = async (id, firstName, lastName, phoneNumber, password ) => {
    const commandParams = {
        TableName: TABLE_NAME,
        Key: {
            id: { S: id },
        },
        UpdateExpression: `SET firstName=:value1, lastName=:value2, phoneNumber=:value3, password=:value4`,
        ExpressionAttributeValues: {
            ":value1": { S: firstName },
            ":value2": { S: lastName },
            ":value3": { S: phoneNumber },
            ":value4": { S: password },
        },
        ReturnValues: "ALL_NEW",
    };

    const responpse = await ddbClient.send(new UpdateItemCommand(commandParams))    
    
    return responpse
}

module.exports = {
    getTableRowV3,
    addUserToDBV3,
    updateUserV3,
};
