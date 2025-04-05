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
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const saveRoutes_1 = __importDefault(require("./routes/saveRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const socket_1 = require("./utils/socket");
// Import Socket and Controllers
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
        credentials: true,
    },
});
// Middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
app.use(express_1.default.json());
// MongoDB Connection
mongoose_1.default
    .connect(process.env.MONGO_URI || '')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));
// Routes
app.use('/api/user', authRoutes_1.default);
app.use('/api/user', postRoutes_1.default);
app.use('/api/user', commentRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/user', saveRoutes_1.default);
app.use('/api/user/message', messageRoutes_1.default);
app.use('/api/user/notification', notificationRoutes_1.default);
// WebSocket Logic
(0, socket_1.initializeSockets)(io);
// Start the server
const port = process.env.PORT;
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
