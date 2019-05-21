const express = require("express");
const { Temperature, Jobs } = require('../models/model');
const multer = require("multer");
var { spawn } = require('child_process')
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'resource/files');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = "json";
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

async function addJobForFileInDb(fileName) {
  const job = new Jobs({
    filename: fileName,
    status: "not started"
  })
  console.log("Job is :" + JSON.stringify(job));
  await job.save().then(createdTempObj => {
    ({
      message: "Job added to DB",
      jobId: createdTempObj._id
    });
    console.log("Job added :" + JSON.stringify(createdTempObj.jobId));
    return createdTempObj.jobId;
  })
}

async function createChildProcess(id) {
  const child = spawn('node', ['processjob.js', 'id']);
  child.on('exit', code => {
    console.log(`Exit code is: ${code}`);
  });
  // for await (const data of child.stdout) {
  //   console.log(`stdout from the child: ${data}`);
  // };
}

router.post('/api/upload-file', multer({ storage: storage }).single("datafile"), (req, res, next) => {
  //const post = req.body;
  var filename = req.file.filename;
  var originalFilename = req.file.originalFilename;
  console.log("New Filename is " + filename);
  console.log("New Filename is " + originalFilename);

  console.log("Req is :" + JSON.stringify(req.body));
  res.status(201).json({
    message: "File uploaded successfully",
  });
  var jobId = addJobForFileInDb(filename);
  createChildProcess(jobId);

})

router.get("/api/upload-file", (req, res, next) => {
  res.status(200).json({
    message: "Welcome to file upload",
  });
});

router.post('/api/temperature', (req, res, next) => {
  const temperatureObject = new Temperature({
    ts: req.body.ts,
    val: req.body.val
  })
  console.log("Req is :" + JSON.stringify(req.body));
  temperatureObject.save().then(createdTempObj => {
    res.status(201).json({
      message: "Temperature added successfully",
      tempId: createdTempObj._id
    });
  })
})

router.get("/api/temperature", (req, res, next) => {
  Temperature.find().sort({ ts: 'desc' }).limit(20).exec((err, documents) => {
    res.status(200).json({
      message: "Temperatures fetched successfully!",
      temperature: documents
    });
  })
})

router.get("/api/job", (req, res, next) => {
  Jobs.find().then(documents => {
    res.status(200).json({
      message: "Jobs fetched successfully!",
      job: documents
    });
  })
});

module.exports = router;