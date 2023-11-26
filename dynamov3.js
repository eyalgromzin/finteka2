const {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');


const ddbClient = new DynamoDBClient({ region: 'us-east-1' })
const TABLE_NAME = 'User3';

const getTableV3 = async () => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: { S: '304565526' },
        }
    };
    const characters = await ddbClient.send(new GetItemCommand(params))
    console.log('111', characters)
    return characters;
}

const createUserV3 = async (firstName, lastName, id, phoneNumber, password) => {
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


const updateUserV3 = async (id, fieldName, fieldValue) => {
    
    const commandParams = {
        TableName: TABLE_NAME,
        Key: {
            id: { S: id },
        },
        UpdateExpression: `SET ${fieldName} = :value`,
        ExpressionAttributeValues: {
            ":value": { S: fieldValue },
        },
        ReturnValues: "ALL_NEW",
    };

    const responpse = await ddbClient.send(new UpdateItemCommand(commandParams))    
    
    return responpse
}

module.exports = {
    getTableV3,
    createUserV3,
    updateUserV3,
};
