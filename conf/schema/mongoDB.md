#MongoDB Validation:
//From tutorial -- Actually just ran this in MongoDB Compass copying the entire 'validator' object value into the validator, using moderate validation level.
// Simply put, the moderation level as moderate allows us to insert items into the database even if there's an error thrown (iirc)
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