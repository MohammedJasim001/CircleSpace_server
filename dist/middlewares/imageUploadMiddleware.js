"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMedia = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_KEY,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
// Configure Multer with memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
});
// Media upload middleware
const uploadMedia = (req, res, next) => {
    upload.single('media')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }
        if (req.file) {
            try {
                const uploadOptions = {
                    folder: 'uploads',
                    resource_type: 'auto', // Correctly typed
                };
                // Upload the file buffer to Cloudinary
                const uploadStream = cloudinary_1.default.v2.uploader.upload_stream(uploadOptions, (error, result) => {
                    if (error) {
                        console.error('Cloudinary Error:', error);
                        return res.status(500).json({
                            message: 'Cloudinary upload failed',
                            error: error.message,
                        });
                    }
                    if (result) {
                        req.cloudinaryMediaUrl = result.secure_url;
                        next();
                    }
                });
                // Write the file buffer to the Cloudinary stream
                if (req.file.buffer)
                    uploadStream.end(req.file.buffer);
            }
            catch (error) {
                console.error('Unexpected Error:', error);
                return res.status(500).json({
                    message: 'Unexpected error occurred during file upload',
                });
            }
        }
        else {
            return res.status(400).json({ message: 'No file uploaded' });
        }
    }));
};
exports.uploadMedia = uploadMedia;
