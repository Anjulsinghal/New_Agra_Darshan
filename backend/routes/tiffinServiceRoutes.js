const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const TiffinService = require('../models/TiffinService');

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dkxrhk27z', // Replace with your Cloudinary cloud name
    api_key: '253413982333269',       // Replace with your Cloudinary API key
    api_secret: 'YPWhJwmz4FkixPT-klIJZ8PtiN0'  // Replace with your Cloudinary API secret
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create Tiffin Service Card
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Upload directly to Cloudinary
        const cloudinaryResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'tiffin-services', resource_type: 'image' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer); // Pass the buffer to Cloudinary
        });

        // Create new Tiffin Service
        const tiffinService = new TiffinService({
            name: req.body.name,
            tag: req.body.tag, // Include the tag
            title: req.body.title,
            description1: req.body.description1,
            imageUrl: cloudinaryResponse.secure_url
        });

        await tiffinService.save();
        res.status(201).json(tiffinService);
    } catch (error) {
        console.error('Error creating tiffin service:', error);
        res.status(500).json({
            error: 'Failed to create tiffin service',
            details: error.message
        });
    }
});

// Get All Tiffin Service Cards
router.get('/', async (req, res) => {
    try {
        const tiffinServices = await TiffinService.find().sort({ createdAt: -1 });
        res.json(tiffinServices);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch tiffin services',
            details: error.message
        });
    }
});

// Delete Tiffin Service Card
router.delete('/:id', async (req, res) => {
    try {
        const deletedService = await TiffinService.findByIdAndDelete(req.params.id);

        if (!deletedService) {
            return res.status(404).json({ error: 'Tiffin service not found' });
        }

        // Delete image from Cloudinary
        if (deletedService.imageUrl) {
            const publicId = deletedService.imageUrl.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        res.json({
            message: 'Tiffin service deleted successfully',
            deletedService
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete tiffin service',
            details: error.message
        });
    }
});

module.exports = router;
