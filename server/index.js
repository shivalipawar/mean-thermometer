const app = require('express')();
const http = require('http').Server(app);
const { Temperature, Jobs } = require('./models/model');
const temperature = require('./temperature');
const io = require('socket.io')(http);
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const temperatureRoutes = require('./routes/route');

const port = 3001;

mongoose.connect("mongodb+srv://username:password@cluster0-z0r7w.mongodb.net/file-upload?retryWrites=true", { useNewUrlParser: true })
  .then(() => {
    console.log("Connection successful to database");
  })
  .catch(() => {
    console.log("Connection failed!")
  })

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json())
app.use(temperatureRoutes);

app.get('/api/test', (req, res) => {
  // Temperature.find().sort({ ts: 'desc' }).limit(20).exec((err, documents) => {
  //   const updated = documents.map(d => {
  //     return {
  //       ts: new Date(new Number(d.ts)).toLocaleDateString().split("/").join("-"),
  //       val: new Number(d.val)
  //     }
  //   })
  //   res.status(200).json(updated);
  // })
  res.send(temperature.temperatures);
});

setInterval(function () {
   temperature.updateTemperature();
  //console.log("Pushing Element : ", marketPositions[0])
  //io.sockets.emit('market', marketPositions[0]);
  io.sockets.emit('temperature', temperature.temperatures[0]);
}, 5000);

io.on('connection', function (socket) {
  console.log('a user connected');
});

http.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
