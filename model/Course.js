const mongoose = require('mongoose');
const { Schema } = mongoose;

const majorSchema = new mongoose.Schema({
  nameOfMajor: { type: String },
  points: { type: Number },
  corePapers: [
    {
      name: { type: String },
      sku: { type: String },
      level: { type: Number },
      point: { type: Number },
      prerequisites: { type: String },
      corequisites: { type: String }
    }
  ],
  electivePapers: [
    {
      name: { type: String },
      sku: { type: String },
      level: { type: Number },
      point: { type: Number },
      prerequisites: { type: String },
      corequisites: { type: String }
    }
  ]
});

module.exports = Course = mongoose.model('courses', majorSchema);
