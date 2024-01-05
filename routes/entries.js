var express = require("express");
const db = require("../database");
var router = express.Router();

// router.get("/", async function (req, res) {
//     // fetch data from postgres
//     const result = await db.query("SELECT * FROM entries;");

//     // send the data as response
//     res.send(result.rows);
// });

router.post("/", async function (req, res) {
    // read data from client
    const { title, value, type } = req.body;

    const errors = [];
    if (title.length < 5) {
        errors.push("Title is too short");
    }
    if (value < 0) {
        errors.push("Value must be positive");
    }
    if (!["income", "expense"].includes(type)) {
        errors.push("Invalid type - please use expense or income");
    }

    if (errors.length > 0) {
        return res.status(400).send({
            errorType: "VALIDATION_ERROR",
            errors,
        });
    }

    // save data to database
    const result = await db.query(
        `INSERT INTO entries (title, value, type) VALUES ($1, $2, $3) RETURNING *;`,
        [title, value, type]
    );

    // send the new entry as response
    res.send(result.rows[0]);
});



// GET /:id - get single entry---------------task1------------------------------
router.get("/:id", async function (req, res){
    const entryId = req.params.id;
    console.log(entryId)

    // fetch data from the database for the specified ID
    const result = await db.query("SELECT * FROM entries WHERE id = $1;", [entryId]);

    if (result.rows.length === 0) {
        return res.status(404).send({
            errorType: "NOT_FOUND_ERROR",
            message: "Entry not found",
        });
    }

    // send the entry as response
    res.send(result.rows[0]);
});
// PATCH /:id - update single entry
// DELTE /:id - delete single entry

module.exports = router;
