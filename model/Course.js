const mongoose = require('mongoose');
const { Schema } = mongoose;

const majorSchema = new mongoose.Schema({
  nameOfMajor: { type: String },
  description: { type: String },
  points: { type: Number },
  corePapers: [
    {
      name: { type: String },
      sku: { type: String },
      level: { type: Number },
      point: { type: Number },
      prescriptor: { type: String },
      year: { type: Number },
      semester: { type: String },
      specificJob: { type: String },
      prerequisites: [{ type: String }],
      followingPaper: [{ type: String }],
      corequisites: [{ type: String }]
    }
  ],
  electivePapers: [
    {
      name: { type: String },
      sku: { type: String },
      level: { type: Number },
      point: { type: Number },
      prescriptor: { type: String },
      year: { type: Number },
      semester: { type: String },
      specificJob: { type: String },
      prerequisites: [{ type: String }],
      followingPaper: [{ type: String }],
      corequisites: [{ type: String }]
    }
  ],
  careerOppotunities: [
    {
      name: {
        type: String
      }
    }
  ]
});

module.exports = Course = mongoose.model('courses', majorSchema);
