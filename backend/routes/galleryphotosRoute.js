const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
const ImageModel = require('../models/ImageModel'); // Assuming you have a Mongoose model

// Multer configuration for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Single Image Upload
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    public_id: `${uuidv4()}`,
                    overwrite: true,
                },
                async (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        // Store image details in MongoDB
        const imageDocument = new ImageModel({
            url: result.secure_url,
            publicId: result.public_id,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        await imageDocument.save();

        return res.status(200).json({ 
            image: { 
                url: result.secure_url, 
                publicId: result.public_id,
                mongoId: imageDocument._id 
            } 
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'An error occurred during upload', error: error.message });
    }
});

// Bulk Image Upload
router.post('/bulk-upload', upload.array('images', 5), async (req, res) => {
    try {
        const uploadPromises = req.files.map(file => 
            new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { 
                        resource_type: 'image', 
                        public_id: `${uuidv4()}`, 
                        overwrite: true 
                    },
                    async (error, result) => {
                        if (error) reject(error);
                        else {
                            // Store each image in MongoDB
                            const imageDocument = new ImageModel({
                                url: result.secure_url,
                                publicId: result.public_id,
                                originalName: file.originalname,
                                mimetype: file.mimetype,
                                size: file.size
                            });

                            await imageDocument.save();

                            resolve({ 
                                url: result.secure_url, 
                                publicId: result.public_id,
                                mongoId: imageDocument._id 
                            });
                        }
                    }
                ).end(file.buffer);
            })
        );

        const results = await Promise.all(uploadPromises);
        return res.status(200).json({ images: results });
    } catch (error) {
        console.error('Bulk upload error:', error);
        return res.status(500).json({ message: 'An error occurred during bulk upload', error: error.message });
    }
});

// Image Deletion (Updated to remove from both Cloudinary and MongoDB)
router.delete('/:publicId', async (req, res) => {
    const { publicId } = req.params;
    try {
        // Delete from Cloudinary
        const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Deletion Result:", cloudinaryResult);

        if (cloudinaryResult.result !== 'ok') {
            return res.status(400).json({
                message: 'Failed to delete from Cloudinary',
                cloudinaryResult
            });
        }

        // Delete from MongoDB
        const mongoResult = await ImageModel.findOneAndDelete({ publicId });
        console.log("MongoDB Deletion Result:", mongoResult);

        if (!mongoResult) {
            return res.status(404).json({ message: 'Image not found in MongoDB' });
        }

        return res.status(200).json({
            message: 'Image deleted successfully',
            cloudinaryResult,
            mongoResult
        });
    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({
            message: 'Failed to delete image',
            error: error.toString()
        });
    }
});
// Retrieve Images
router.get('/', async (req, res) => {
    try {
        const images = await ImageModel.find();
        return res.status(200).json({ images });
    } catch (error) {
        console.error('Retrieve images error:', error);
        return res.status(500).json({ message: 'Failed to retrieve images', error: error.message });
    }
});

module.exports = router;