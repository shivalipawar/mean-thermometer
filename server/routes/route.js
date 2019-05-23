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
  var createdJobId;
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
    console.log("Job added :" + JSON.stringify(createdTempObj._id));
    createdJobId = createdTempObj._id;
  })
  return createdJobId;
}

async function addJobIdInDB(filename) {
  var jobId = await addJobForFileInDb(filename);
  console.log("Job id is " + jobId);
  return jobId;
}

async function createChildProcess(id) {
  console.log("In child process"+" id is "+id);
  const ls = spawn('node', ['processjob.js', id]);
  ls.on('exit', code => {
    console.log(`Exit code is: ${code}`);
  });
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
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
  getJobId(filename);
})

async function getJobId(filename){
  var jobId = await addJobIdInDB(filename);
  console.log("We got job id as "+jobId); 
  createChildProcess(jobId);
}

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

router.delete("/api/temperature/clear", (req, res, next) => {
  Temperature.remove().exec().then(res =>{
    console.log(result);
    res.status(200).json({message:"Temperatures deleted"});
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

router.delete("/api/job/clear", (req, res, next) => {
  Jobs.remove().exec().then(res =>{
    console.log(result);
    res.status(200).json({message:"Jobs deleted"});
  })
});

module.exports = router;

