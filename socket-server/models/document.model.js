const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
      required: true
    },
    text: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
