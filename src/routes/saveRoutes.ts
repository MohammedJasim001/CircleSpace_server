import express from 'express'
import tryCatchMiddleware from '../middlewares/tryCatchMiddleware'
import { toggleSavePost } from '../controller/saveController'

const router = express.Router()

router.post('/posts/save',tryCatchMiddleware(toggleSavePost))

export default router