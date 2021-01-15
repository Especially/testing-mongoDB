const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const assert = require('assert');
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'mongoTest';

// Reusability is so nice let's see what we can do 
class database {

    connect = (collection, execute, payload) => {
        if (!collection) {
            console.log('Error')
            return false;
        }

        const clientConnect = new Promise((resolve, reject) => {
            client.connect((err) => {
                if (err) {
                    reject({ success: false, msg: err })

                } else {
                    let db = client.db(dbName);
                    // let result;
                    // console.log(db.collection('accounts'));
                    if (typeof (collection) === 'object') {
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
                        return execute(currCol, payload)
                            .then(res => {
                                console.log('Successful Result:', res)
                                return resolve({ success: true, msg: 'resolved', result: res });

                            })
                            .catch(err => {
                                console.log('Failed', err)
                                return reject({ success: false, msg: err })
                            })
                    }
                }
            })
        });

        return clientConnect
    }

    lookupID = (payload) => {
        const collection = 'users';
        // const collection = ['accounts', 'bank'];
        this.connect(collection, this.findUser, payload).then((res) => console.log('result--', res)).catch(err => console.log(err));
    }

    findUser = (collection, payload) => {
        const cb = new Promise((resolve, reject) => {
            collection.findOne(payload, (err, result) => {
                if (err || !result) {
                    console.log('Error');
                    reject({ success: false, msg: 'No user with your parameters were found: ', payload: JSON.stringify(payload) });// Reject, user not found
                } else {
                    console.log('FindUser found a result:', result);

                    resolve(result);
                }
            })
        })
        return cb;
    }

    addUser = (payload) => {
        const collection = 'users';
        // const collection = ['accounts', 'bank'];
        this.connect(collection, this.createUser, payload).then(res => console.log('result', res)).catch(err => console.log(err))
        // console.log(id, this.state, this.props);
    }

    createUser = (collection, payload) => {
        const cb = new Promise((resolve, reject) => {
            console.log('Running promise')
            collection.insertOne(payload, (err, result) => {
                if (err) {
                    console.log('Error')
                    reject({ success: false, msg: err });// Reject, user not found, or failed validation
                } else {
                    console.log('Create added:', result.result.n, 'user to the database.', result.ops[0].name)
                    resolve(result.result);
                }
            })
        })
        return cb;
    }
}

class accountUtil {
    validPassword = (password) => {
        // Check if the password provided meets all of the requirements
        password = password.trim();
        let err = [];
        let response;
        let minLen = 6;
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
                password
            }
        }
        return response;
        // if successful and we need the hash, return hashed password func
        // If we don't need the hash, simply return strength level or something
        return password;
    }

    convertPassword = () => {

    }

    verifyPassword = () => {

    }
}

console.log(new accountUtil().validPassword('aA'))
//MongoDB Demo docs
const insertDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
    ], function (err, result) {
        assert.strictEqual(err, null);
        assert.strictEqual(3, result.result.n);
        assert.strictEqual(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}
//MongoDB Demo docs
const dbConnect = () => {
    const MongoClient = require('mongodb').MongoClient;
    // Connection URL
    const url = 'mongodb://localhost:27017';

    // Database Name
    const dbName = 'mongoTest';

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect(function (err) {
        assert.strictEqual(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        removeDocument(db, function () {
            client.close();
        });

    });
}

module.exports.database = new database;