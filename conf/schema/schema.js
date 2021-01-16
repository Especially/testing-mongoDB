// It was at this point where I realized that I was in a dilemma.
// The tutorial i was watching was actually using mongoose! and not mongodb, but i had already set up my code, and it was working,
// but the way that they set up their schema's made it look so fun and exciting, but... since I was already using mongodb, i decided to make my own validation

const { accountUtil } = require("../../lib/utils");

// and use classes more in my code, classes are fun and i need to brush up on them, clearly!!
class userSchema {
    constructor(payload) {
        this.err = [];
        this.strict = true;
        this.aggregateErr = true;
        this.render = this.render.bind(this);
        this.data = {
            email: this.validate(payload.email, { type: 'string', name: 'email', required: true,}),
            password: this.validate(payload.password, { type: 'password', name: 'password', required: true,}),
            name: this.validate(payload.name, { type: 'string', name: 'name', required: true,}),
            ip: this.validate(payload.ip, { type: 'string', name: 'ip',}),
            created: this.validate(payload.timestamp, { type: 'timestamp', bypass: true, name: 'timestamp',}),
            // id: this.validate(payload.id, { type: 'string', name: 'id', required: true,}), Pointless, mongo creates this for us
        }

    }

    validate(item, options) {
        //Regex option
        // Required Check

        // Trim our strings
        if (options.type === 'string') {
            item = item ? item.trim() : '';
        }

        // Type check
        if (options.type === 'timestamp') {
            let getTimestamp = (num) => new Date(num).getTime();

            if (isNaN(getTimestamp(item))) { // If bypass, try to resolve error on the server side
                if (options.bypass) item = new Date().getTime();
            }
            if (isNaN(getTimestamp(item))) {
                if (this.aggregateErr) {
                    this.err.push({ item: options.name, msg: `Expected a(n) ${options.type}, received ${typeof (item)} ${item}` });
                }
            }

        } else if (options.type === 'password') {
            let isValidated = accountUtil.validPassword(item);
            if (isValidated.success) {
                item = isValidated.payload;
            } else {
                this.err.push({item: options.name, payload: isValidated.msg})
            }
        } else {
            // Consider switch statement
            // Default behaviour, if type doesn't match
            if (typeof (item) !== options.type) {
                if (this.aggregateErr) {
                    this.err.push({ item: options.name, msg: `Expected a(n) ${options.type}, received ${typeof (item)}` });
                }
            }
        }

        if (options.required) {

            if (!item) {
                if (this.aggregateErr) { // If no aggregation throw on first error we see with that specific error rather than an arr.
                    // This error should take precedence over password validation errors
                    this.err.push({ item: options.name, msg: 'Cannot be empty' });
                }
            }
        }

        // Regex
        if (options.regex) {
            // Password regex will be separate, utilize type:password to use password utility functions
        }

        return item
    }

    render = () => {
        let responseObj = this;
        let msg;

        if (responseObj.err.length > 0) {
            // Strict mode allows me to throw an error response with JUST the error message, otherwise we'll receive the whole class obj
            // Allows testing with errors
            if (this.strict) {
                msg = responseObj.err
            } else {
                msg = { msg: responseObj.err, payload: responseObj.data }
            }
            responseObj = {
                success: false,
                msg
            }
        } else {
            msg = responseObj.data;
            responseObj = {
                success: true,
                payload: msg
            }
        }

        return responseObj;
    }
}


// console.log(new userSchema({ id: 'a', name: 'a', email: 'a', ip: 'a' }).render())
// console.log(new userSchema({ id: 'a', name: 'a', email: 'a', ip: 'l',password: 'aaaaA3!' }).render())

module.exports.userSchema = userSchema;