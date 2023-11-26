const AWS = require("@aws-sdk/client-cognito-identity-provider");
const {
    CognitoIdentityProviderClient,
    SignUpCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const loginUser = async (username, password) => {
    const client = new AWS.CognitoIdentityProvider({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    return new Promise((resolve, reject) => {
        client.initiateAuth(
            {
                ClientId: "1k2pmc8qs78tsnfcrs5pak57p7", //process.env.AWS_CLIENT_ID,
                AuthFlow: "USER_PASSWORD_AUTH",
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password,
                },
            },
            function (err, data) {
                if (err) {
                    return res.json({
                        status: 400,
                        message: `login error: ${err}`,
                    });
                    reject(err);
                }
                console.log("login success");
                console.log("data: ", data);
                resolve(data);
            }
        );
    });
};

const signUpUser = async (username, password, email) => {
    const client = new CognitoIdentityProviderClient({ region: "us-east-1" }); // Replace "REGION" with your AWS region
    const signUpParams = {
        ClientId: "1k2pmc8qs78tsnfcrs5pak57p7", // Replace with your user pool client ID
        Username: username, // Replace with the desired username
        Password: password, 
        UserAttributes: [
            {
                Name: "email", // Required attribute
                Value: email,
            },
        ],
    };

    try {
        const data = await client.send(new SignUpCommand(signUpParams));
        return data
    } catch (error) {
        throw `${error}`
    }
};

module.exports = {
    loginUser,
    signUpUser,
};
