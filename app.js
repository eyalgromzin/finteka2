const express = require("express");
var bodyParser = require("body-parser");
const app = express();

const { getTableRowV3, createUserV3, updateUserV3 } = require("./dynamov3");
const { loginUser } = require("./cognitov3");

app.use(express.json());
app.use(bodyParser.json({ type: "application/*+json" }));

const phoneRegex = /^05\d([-]{0,1})\d{7}$/;

//works
app.get("/getTableV3", async (req, res) => {
    try {
        const id = req.query.id;
        console.log("id: ", id);
        const table = await getTableRowV3(id);
        res.json(table);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});

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

//works
app.put("/updateUserV3", async (req, res) => {
    try {
        const { id, fieldName, fieldValue } = req.body;

        const result = await updateUserV3(id, fieldName, fieldValue);

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
        if (firstName.length < 1 || firstName.length > 20) {
            return res.json({
                status: 400,
                message: "invalid first name",
            });
        }

        const lastName = req.body.lastName;
        if (lastName.length < 1 || lastName.length > 20) {
            return res.json({
                status: 400,
                message: "invalid last name",
            });
        }

        const id = req.body.id;
        if (!isValidIsraeliID(id)) {
            return res.json({
                status: 400,
                message: "invalid israeli id",
            });
        }

        const phoneNumber = req.body.phoneNumber;
        if (!phoneRegex.test(phoneNumber)) {
            return res.json({
                status: 400,
                message: "invalid mobile number",
            });
        }

        const password = req.body.password;
        if (password.length < 6) {
            return res.json({
                status: 400,
                message: "password must be at least 6 chars ",
            });
        }

        const result = await createUserV3(
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

app.get("/characters/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const character = await getCharacterById(id);

        res.json(character);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});

app.put("/characters/:id", async (req, res) => {
    const character = req.body;
    const { id } = req.params;
    character.id = id;
    try {
        const newCharacter = await addOrUpdateCharacter(character);
        res.json(newCharacter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});

app.delete("/characters/:id", async (req, res) => {
    const { id } = req.params;
    try {
        res.json(await deleteCharacter(id));
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
