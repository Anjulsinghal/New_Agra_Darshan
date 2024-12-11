const mongoose = require('mongoose');

const TiffinServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Initiator name is required'],
    trim: true
  },
  tag: {
    type: String,
    required: [true, 'Tag is required'],
  },
  title: {
    type: String,
    required: [true, 'Card title is required'],
    trim: true
  },
  description1: {
    type: String,
    required: [true, 'First description is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TiffinService', TiffinServiceSchema);