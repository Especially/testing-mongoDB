class userSchema {
    constructor(payload) {
        this.err = [];
        this.strict = true;
        this.render = this.render.bind(this);
        this.email = this.validate(payload.email, { type: 'string', name: 'email', required: true, aggregateErr: true });
        this.name = this.validate(payload.name, { type: 'string', name: 'name', required: true, aggregateErr: true });
        this.ip = this.validate(payload.ip, { type: 'number', name: 'ip', aggregateErr: true });
        this.id = this.validate(payload.id, { type: 'string', name: 'id', required: true, aggregateErr: true });

    }

    validate(item, options) {
        if (options.required) {
            if (!item) {
                if (options.aggregateErr) {
                    this.err.push({ item: options.name, msg: 'Cannot be empty' });
                }
            }
        }
        if (typeof (item) !== options.type) {
            if (options.aggregateErr) {
                this.err.push({ item: options.name, msg: `Expected a(n) ${options.type}, received ${typeof (item)}` });
                // console.log(this.err);
            }
        }

        return item
    }

    res = () => {
        let responseObj = this;


        if (responseObj.err.length > 0) {

        } else {

        }

    }

    render = () => {
        return ((this.err.length > 0) ? this.err : this);
    }
}


console.log(new userSchema({ id: 'a', name: 'a', email: 'a', ip: 'a' }).render())
console.log(new userSchema({ id: 'a', name: 'a', email: 'a', ip: 5 }).render())