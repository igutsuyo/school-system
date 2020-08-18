"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose;

var studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    tell: {
      type: String,
      required: true
    },
    town: {
      type: String,
      required: true
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  {
    timestamps: true
  }
);

studentSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Tell: ${this.tell}`;
};

module.exports = mongoose.model("student", studentSchema);
