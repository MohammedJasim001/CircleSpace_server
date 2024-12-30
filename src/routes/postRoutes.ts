import express from 'express'
import tryCatchMiddleware from '../middlewares/tryCatchMiddleware'
import { createPost, getPost, toggle_like } from '../controller/postController'
import { uploadImage } from '../middlewares/imageUploadMiddleware'

const router = express.Router()

router.post('/post/:author',uploadImage,tryCatchMiddleware(createPost))
router.get('/post',tryCatchMiddleware(getPost))
router.post('/posts/like',tryCatchMiddleware(toggle_like))

export default router