"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatchMiddleware_1 = __importDefault(require("../middlewares/tryCatchMiddleware"));
const saveController_1 = require("../controller/saveController");
const router = express_1.default.Router();
router.post('/posts/save', (0, tryCatchMiddleware_1.default)(saveController_1.toggleSavePost));
exports.default = router;
