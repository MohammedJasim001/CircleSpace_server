"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controller/commentController");
const tryCatchMiddleware_1 = __importDefault(require("../middlewares/tryCatchMiddleware"));
const router = express_1.default.Router();
router.post('/comment', (0, tryCatchMiddleware_1.default)(commentController_1.addComment));
exports.default = router;
