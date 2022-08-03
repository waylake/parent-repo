// // Making Connection
// const MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://test1:test1234@3.35.243.113:27017/?authMechanism=DEFAULT&authSource=admin';
// // database
// // Created or Switched to collection
// MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
//     if (err) throw err;
//     const db = client.db("testdb");
//     let collection = db.collection('test01');
//     let query = { _id: 'NCT05444088' } // 여기 nct만 바꿔가며 원하는 json파일 read하는 js코드
//     collection.findOne(query).then(doc => {
//         console.log(doc);
//     }).catch((err) => {
//         console.log(err);
//     }).finally(() => {
//         client.close();
//     });
// });