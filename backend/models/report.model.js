const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeReports = new Schema({
    title: {
      unique: true,
      type: String,
    },
    properties: [{
        employee_id: {
          type: String,
          trim: true, // trims whitespace
          lowercase: true,
          required: false
        },
        date: {
          type: String,
          required: false,
          trim: true
        },
        hours_worked: {
          type: String,
          required: false,
          trim: true
        },
        job_group: {
          type: String,
          trim: true,
          required: false
        }
    }],
 additionalProperties: false
});

module.exports = mongoose.model('Report', employeeReports);