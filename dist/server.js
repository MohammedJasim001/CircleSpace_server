"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const saveRoutes_1 = __importDefault(require("./routes/saveRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
app.use(express_1.default.json());
const port = process.env.PORT || 5000;
mongoose_1.default.connect(process.env.MONGO_URI || '')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));
app.use('/api/user', authRoutes_1.default);
app.use('/api/user', postRoutes_1.default);
app.use('/api/user', commentRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/user', saveRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
