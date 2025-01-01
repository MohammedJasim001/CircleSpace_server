import express from 'express'
import tryCatchMiddleware from '../middlewares/tryCatchMiddleware'
import { createPost, getPost, getVideoPosts, toggle_like } from '../controller/postController'
import { uploadMedia } from '../middlewares/imageUploadMiddleware'

const router = express.Router()

router.post('/post/:author',uploadMedia,tryCatchMiddleware(createPost))
router.get('/post',tryCatchMiddleware(getPost))
router.post('/posts/like',tryCatchMiddleware(toggle_like))
router.get('/videos',getVideoPosts)

export default router