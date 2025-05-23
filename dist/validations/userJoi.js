"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userAuthJoi = joi_1.default.object({
    name: joi_1.default.string().required()
        .messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required field'
    }),
    userName: joi_1.default.string().required()
        .messages({
        'string.empty': 'Username is required',
        'any.required': 'Username is required field'
    }),
    email: joi_1.default.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'org'] },
    }).lowercase().required().trim()
        .messages({
        'String.email': 'Please provide a valid email',
        'any.required': 'Email is required field'
    }),
    password: joi_1.default.string().min(4).max(20).required()
        .pattern(new RegExp("^[a-zA-Z0-9]{4,20}$"))
        .messages({
        'String.pattern.base': 'Password must contain alphanumeric characters',
        'String.min': 'Password should have atleast 4 charactesr',
        'String.max': "Password don't allow more than 20 characters",
        'any.required': 'Password is required field'
    }),
}).options({ allowUnknown: true });
exports.default = userAuthJoi;
