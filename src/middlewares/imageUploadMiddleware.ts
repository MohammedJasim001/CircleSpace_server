import cloudinary from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_KEY,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
});

// Media upload middleware
export const uploadMedia = (req: any, res: Response, next: NextFunction) => {
    upload.single('media')(req, res, async (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }

        if (!req.file) {
            console.log('No file uploaded, proceeding without media.');
            return next(); // Allow request to proceed even if no file is uploaded
        }

        try {
            const uploadOptions: cloudinary.UploadApiOptions = {
                folder: 'uploads',
                resource_type: 'auto',
            };

            // Upload the file buffer to Cloudinary
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Error:', error);
                        if (!res.headersSent) {
                            return res.status(500).json({
                                message: 'Cloudinary upload failed',
                                error: error.message,
                            });
                        }
                    }

                    if (result) {
                        req.cloudinaryMediaUrl = result.secure_url;
                        console.log('File uploaded to Cloudinary:', result.secure_url);
                        next();
                    }
                }
            );

            // Write the file buffer to the Cloudinary stream
            if (req.file.buffer) uploadStream.end(req.file.buffer);
        } catch (error) {
            console.error('Unexpected Error:', error);
            return res.status(500).json({ message: 'Unexpected error during file upload' });
        }
    });
};
