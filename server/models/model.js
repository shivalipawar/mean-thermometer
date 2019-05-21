const mongoose = require('mongoose');

//schema creation from docs and its just the blueprint.
const temperatureSchema = mongoose.Schema({
  ts : {type:String, required :true},
  val : {type:String, required :true}
})

const jobSchema = mongoose.Schema({
  filename :{type:String, required: true},
  status :{type:String, required :true}
})

module.exports = {
  Temperature : mongoose.model('Temperature',temperatureSchema),
  Jobs :mongoose.model('Jobs',jobSchema)
}
