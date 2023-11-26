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

function isValidIsraeliID(id) {
    var id = String(id).trim();
    if (id.length > 9 || id.length < 5 || isNaN(id)) return false;

    // Pad string with zeros up to 9 digits
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

    return (
        Array.from(id, Number).reduce((counter, digit, i) => {
            const step = digit * ((i % 2) + 1);
            return counter + (step > 9 ? step - 9 : step);
        }) %
            10 ===
        0
    );
}

const checkField = (fieldName, value) => {
    if (!value) {
        return false;
    }

    if (fieldName == "id") {
        return isValidIsraeliID(value);
    } else if (fieldName == "lastName" || fieldName == "firstName") {
        if (value > 20) {
            return false;
        }
    } else if (fieldName == "phoneNumber") {
        const phoneRegex = /^05\d([-]{0,1})\d{7}$/;
        return phoneRegex.test(value);
    } else if (fieldName == "password") {
        return value.length > 6;
    } else {
        return false;
    }

    return true;
};

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
    
    const fieldNames = [
        "id",
        "firstName",
        "lastName",
        "phoneNumber",
        "password",
    ];

    if (!fieldNames.includes(fieldName)) {
        return { err: "field name not in fields" }
    }

    if (!checkField(fieldName, fieldValue)) {
        return {
            status: 400,
            message: "invalue field / field value ",
        }
    }

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
    getTableRowV3,
    createUserV3,
    updateUserV3,
    checkField,
};
