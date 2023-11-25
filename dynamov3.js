const {
    DynamoDBClient,
    GetItemCommand
} = require('@aws-sdk/client-dynamodb')


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

module.exports = {
    getTableV3,
};
