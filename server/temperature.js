const moment = require('moment');

const temperatures = [
    { "ts": "10-05-2012", "val": 59 },
    { "ts": "04-05-2012", "val": 79 },
    { "ts": "03-05-2012", "val": 41 },
    { "ts": "01-05-2012", "val": 76 },
    { "ts": "29-04-2012", "val": 30 },
    { "ts": "28-04-2012", "val": 20 },
    { "ts": "27-04-2012", "val": 20 },
    { "ts": "26-04-2012", "val": 10 }
  ];

let counter = 0;

function updateTemperature() {
  const diff = Math.floor(Math.random() * 1000) / 100;
  const lastDay = moment(temperatures[0].ts, 'DD-MM-YYYY').add(1, 'days');

  let val;
  if (counter % 2 === 0) {
    val = temperatures[0].val + diff;
  } else {
    val = Math.abs(temperatures[0].val - diff);
  }

  temperatures.unshift({
    ts: lastDay.format('DD-MM-YYYY'),
    val
  });
  counter++;
}

module.exports = {
  temperatures,
  updateTemperature,
};
