const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    publicId: {
        type: String,
        required: true,
        unique: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Image', ImageSchema);