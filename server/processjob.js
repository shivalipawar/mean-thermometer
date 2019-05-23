const StreamArray = require('stream-json/streamers/StreamArray');
const path = require('path');
const fs = require('fs');
const { Temperature, Jobs } = require('./models/model');
const mongoose = require('mongoose');
const jsonStream = StreamArray.withParser();
// 1-> get JOB ID from cmd args
// 2 -> get filename/path from table for given hob ID.
// 
var currDoc;
var stream;
var jobId = process.argv[2];
console.log(process.argv)
console.log("Job id is: " + jobId);
connectToDb().then(() => {
    getFileNameForJob(jobId).then((res) => {
        currDoc = res;
        console.log("Document is " + JSON.stringify(currDoc));
        processFile(currDoc);
    })
})
//processFile(currDoc);

async function connectToDb() {
    await mongoose.connect("mongodb+srv://shivali:lQF9ciO6oEVQq9tK@cluster0-z0r7w.mongodb.net/file-upload?retryWrites=true", { useNewUrlParser: true })
        .then(() => {
            console.log("Connection successful to database");
        })
        .catch(() => {
            console.log("Connection failed!")
        })
}

async function getFileNameForJob(jobId) {
    var document = {}
    await Jobs.findById(jobId).then(documents => {
        ({
            message: "Jobs fetched successfully!",
            job: documents
        });
        console.log("Document is in filename method " + JSON.stringify(documents));
        document = documents;
    })
    return document;
}

function processFile(documents) {
    //You'll get json objects here
    //Key is an array-index here
    console.log("___________________", documents)
    var start = new Date()
    jsonStream.on('data', ({ key, value }) => {
        const temperatureObject = new Temperature({
            ts: value.ts,
            val: value.val
        })
        temperatureObject.save().then(createdTempObj => {
            console.log("Written successfully--", temperatureObject);
        })
        // console.log("----", key, "----", value);
    });

    jsonStream.on('end', () => {
        console.log('All done');
        // 1-> UPdate job status for as success for given JOb id
        updateStatusOfJob(documents)
        jsonStream.end();
        stream.end();
    });

    // const data_dir = "c://"
    //if JOB failed mark job as failed for given job ID.
    //const filename = "D:\Shivali\AngularProjects\d3-angular6-socketio\angular-d3-socketio\server\resource\files" + documents.filename;
    const filename = path.join(__dirname, "\\resource\\files\\" + documents.filename);
    console.log("dir path: " + filename);
    const stream = fs.createReadStream(filename).pipe(jsonStream.input);
    var end = new Date() - start
    console.info('Execution time: %dms', end)
}

async function updateStatusOfJob(doc) {
    const job = new Jobs({
        _id: doc._id,
        filename: doc.filename,
        status: "processed"
    })
    Jobs.updateOne({ _id: doc._id }, job).then(result => {
        console.log("Update Successful!");
    })
}
