const express = require("express");
var bodyParser = require("body-parser");
const app = express();

const { getTableRowV3, addUserToDBV3, updateUserV3, checkField } = require("./dynamov3");
const { loginUser, signUpUser } = require("./cognitov3");

app.use(express.json());
app.use(bodyParser.json({ type: "application/*+json" }));


// 2
app.post("/user", async (req, res) => {
    try{
        const { username, password, email, firstName, lastName, id } = req.body

        if (!validateAllFields(id, firstName, lastName, phoneNumber, password)){
            return res.json({
                status: 400,
                message: "some of the fields are invalid",
            });
        }

        const createCognitoUserResult = await signUpUser(username, password, email)
        
        const createDynamoUserResult = await addUserToDBV3(firstName, lastName, id, username, password)

        return res.json({
            status: 200,
            message: "user created",
            createCognitoUserResult: createCognitoUserResult,
            createDynamoUserResult: createDynamoUserResult
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err,
        });
    }
})

//5
app.get("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id: ", id);
        const table = await getTableRowV3(id);
        res.json(table);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});

//3
app.post("/user/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const result = await loginUser(username, password)

        return res.json({
            status: 200,
            message: "login success",
            result: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Something went wrong",
            error: err,
        });
    }
});

// 4
app.put("/updateUserV3", async (req, res) => {
    try {
        const { id, firstName, lastName, phoneNumber, password } = req.body;

        if (!validateAllFields(id, firstName, lastName, phoneNumber, password)){
            return res.json({
                status: 400,
                message: "some of the fields are invalid",
            });
        }

        const tableRow = await getTableRowV3(id);

        if (tableRow.Item.firstName.S ==  firstName && 
            tableRow.Item.lastName.S ==  lastName &&
            tableRow.Item.phoneNumber.S ==  phoneNumber &&
            tableRow.Item.password.S ==  password){
                return res.json({
                    status: 400,
                    message: "all fields are the same, change at least 1 field",
                });
            }

        const result = await updateUserV3(id, firstName, lastName, phoneNumber, password );

        res.json(result);
    } catch (err) {
        console.error(err);
        return res.json({
            status: 400,
            message: "invalid field name",
        });
    }
});

//works
app.post("/createUserV3", async (req, res) => {
    try {
        const firstName = req.body.firstName;
        if (!checkField('firstName', firstName)) {
            return res.json({
                status: 400,
                message: "invalid first name",
            });
        }

        const lastName = req.body.lastName;
        if (!checkField('lastName', lastName)) {
            return res.json({
                status: 400,
                message: "invalid last name",
            });
        }

        const id = req.body.id;
        if (!checkField('id', id)) {
            return res.json({
                status: 400,
                message: "invalid israeli id",
            });
        }

        const phoneNumber = req.body.phoneNumber;
        if (!checkField('phoneNumber', phoneNumber)) {
            return res.json({
                status: 400,
                message: "invalid mobile number",
            });
        }

        const password = req.body.password;
        if (!checkField('password', password)) {
            return res.json({
                status: 400,
                message: "password must be at least 6 chars ",
            });
        }

        const result = await addUserToDBV3(
            firstName,
            lastName,
            id,
            phoneNumber,
            password
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong", error: err });
    }
});




const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
