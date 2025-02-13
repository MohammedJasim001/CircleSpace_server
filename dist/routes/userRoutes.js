"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const tryCatchMiddleware_1 = __importDefault(require("../middlewares/tryCatchMiddleware"));
const imageUploadMiddleware_1 = require("../middlewares/imageUploadMiddleware");
const router = express_1.default.Router();
router.get('/profile/:id', (0, tryCatchMiddleware_1.default)(userController_1.profile));
router.get('/suggestions/:id', (0, tryCatchMiddleware_1.default)(userController_1.suggestionProfiles));
// router.get('/user/:id')
router.post('/follow', (0, tryCatchMiddleware_1.default)(userController_1.toggleFollow));
router.get('/search', (0, tryCatchMiddleware_1.default)(userController_1.searchUsers));
router.put('/editprofile/:userId', imageUploadMiddleware_1.uploadMedia, (0, tryCatchMiddleware_1.default)(userController_1.editProfile));
exports.default = router;
