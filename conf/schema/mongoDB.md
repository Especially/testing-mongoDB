#MongoDB Validation:

~~~~
db.runCommand({
    collMod: "account",
    validator: { $jsonSchema: {
        bsonType: "object",
        required: ["name","email","ip","password"],
        properties: {
            name: {
                bsonType: "string",
                description: "This field is required, and it must be a string."
            },
            email: {
                bsonType: "string",
                description: "This field is required, and it must be a string."
            },
            ip: {
                bsonType: "string",
                description: "This field is required, and it must be a string."
            },
            password: {
                bsonType: "string",
                description: "This field is required, and it must be a string."
            },
        }
    }},
    validationLevel: "moderate"
})

// For reference below, things like choosing between certain values would use the property enum for bson validation:

{
    status: {
        enum: ["Unknown", "Incomplete"],
        description: "can only be one of the two values"
    }
}
~~~~