const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const assert = require('assert');
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'mongoTest';

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