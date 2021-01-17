const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const url = 'mongodb://localhost:27017';
const assert = require('assert'); // Utilize in production for checking
const dbName = 'mongoTest';

class database {
    constructor(props) {
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 30000, keepAlive: 1 });
    }
    connect = (collection, execute, payload = null) => {
        if (!collection) {
            console.log('Error')
            return false;
        }

        const clientConnect = new Promise((resolve, reject) => {
            this.client.connect((err) => {
                if (err) {
                    reject({ success: false, msg: err })

                } else {
                    let db = this.client.db(dbName);
                    // let result;
                    // console.log(db.collection('accounts'));
                    if (typeof (collection) === 'object') {
                        // Need an examaple use-case.
                        // collection.forEach((colName) => {
                        //     let currCol = db.collection(colName).find();
                        //     // execute function(s)
                        //     return Promise.all(execute, payload)
                        //         .then(res => {
                        //             result = res;
                        //         })
                        //         .catch(err => {
                        //             reject({ success: false, msg: err })
                        //         })
                        // })
                    } else {
                        let currCol = db.collection(collection);
                        // execute function(s)
                        return execute(currCol, payload, db)
                            .then(res => {
                                console.log('Successful Result:', res);
                                return resolve({ success: true, data: res });

                            })
                            .catch(err => {
                                console.log('Failed', err)
                                return reject(err)
                            })
                    }
                }
                this.client.close()
            })
        });

        return clientConnect
    }

    // Simple func to clear db of tests
    deleteAll = () => {
        return this.connect('users', this.clearAll)
    }

    clearAll = (collection) => {
        const cb = new Promise((resolve, reject) => {
            collection.deleteMany({}, (err, result) => {
                if (err) {
                    reject({ success: false, msg: err });
                } else {
                    resolve(result);
                }
            });
        })

        return cb;
    }

    // Lookup User
    lookupID = (payload) => {
        const collection = 'users';
        // const collection = ['accounts', 'bank'];
        return this.connect(collection, this.findUser, payload)
    }

    findUser = (collection, payload) => {
        const cb = new Promise((resolve, reject) => {
            // Insecure find query - reduce to certain obj keys, e.g., id, email, etc. not just **anything**
            collection.findOne(payload, (err, result) => {
                if (err || !result) {
                    reject({ success: false, msg: 'No user with your parameters were found: ', payload: JSON.stringify(payload) });// Reject, user not found
                } else {
                    resolve(result);
                }
            })
        })
        return cb;
    }


    // Create User
    addUser = (payload) => {
        const collection = 'users';
        // const collection = ['accounts', 'bank'];
        return this.connect(collection, this.createUser, payload)
    }

    createUser = (collection, payload, db) => {
        let usersCol = db.collection('users');
        const cb = new Promise((resolve, reject) => {
            // First, let's see if this user already exists
            this.findUser(usersCol, { email: payload.email })
                .then(_res => {
                    reject({ success: false, msg: 'An account with this email already exists.' });
                })
                .catch(_err => {
                    // User doesn't exist, proceed
                    collection.insertOne(payload)
                        .then(res => {
                            let { name, ip, email } = res.ops[0];
                            resolve({ name, ip, email });
                        })
                        .catch(err => {
                            console.log('Error')
                            reject({ success: false, msg: err });// Reject, user not found, or failed validation
                        })
                });
        })
        return cb;
    }


    // Login Auth
    logIn = (payload) => {
        const collection = 'users';

        return this.connect(collection, this.logInAuth, payload)
    }

    logInAuth = (collection, payload) => {

        const cb = new Promise((resolve, reject) => {
            // First: Lookup by payload.email
            // if success, check valid password by obtaining hash
            console.log(payload);
            this.findUser(collection, { email: payload.email })
                .then(res => {
                    let { password, name, email, _id } = res;
                    new accountUtil().verifyPassword(payload.password, password)
                        .then(data => {
                            if(data) {
                                resolve({_id, name, email})
                            } else {
                                // Log login attempts
                                reject({success: false, msg: 'Invalid password.'})
                            }
                        })
                        .catch(_error => {
                            reject({success: false, msg: 'Unexpected error occured in verification.'})
                        })
                })
                .catch(err => {
                    // User doesn't exist!
                    reject({ success: false, msg: 'Email not found', err });
                });

        })

        return cb
    }
}


class accountUtil {
    validPassword = (password) => {
        // Check if the password provided meets all of the requirements
        password = password ? password.trim() : '';
        let err = [];
        let response;
        // Front-end: Consider displaying pw requirements in a popup or onHover to inform users of requirements when trying to log in, will save from password requests when they try their regular password with the first symbol password that they think of lol
        let minLen = 7;
        let hasLower = password.match(/(?=.*[a-z])/);
        let hasUpper = password.match(/(?=.*[A-Z])/);
        let hasDigit = password.match(/(?=.*[\d])/);
        let hasSpecial = password.match(/(?=.*[-+=!@#$_%^&*(),.?'":{}|<>])/);

        //Valid Password requirements
        if (password.length === 0) {
            let invalid = { item: 'length', err: 'missing' };
            err.push(invalid);
        }
        if (password.length < minLen) {
            let invalid = { item: 'length', err: 'short' };
            err.push(invalid);
        }
        if (!hasLower) {
            let invalid = { item: 'lowercase', err: 'missing' };
            err.push(invalid);
        }
        if (!hasDigit) {
            let invalid = { item: 'digit', err: 'missing' };
            err.push(invalid);
        }
        if (!hasUpper) {
            let invalid = { item: 'uppercase', err: 'missing' };
            err.push(invalid);
        }
        if (!hasSpecial) {
            let invalid = { item: 'symbol', err: 'missing' };
            err.push(invalid);
        }


        if (err.length) {
            response = {
                success: false,
                msg: err
            }
        } else {
            response = {
                success: true,
                payload: this.convertPassword(password)
            }
        }
        return response;
        // if successful and we need the hash, return hashed password func
        // If we don't need the hash, simply return strength level or something
    }

    convertPassword = (password) => {
        return bcrypt.hashSync(password, 10);
    }

    verifyPassword = (password, hash) => {
        return bcrypt.compare(password, hash);
    }
}

// console.log(new accountUtil().validPassword('aAb!bb5'))
module.exports.accountUtil = accountUtil;
module.exports.database = database;