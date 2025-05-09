import express from 'express'
import { addComment } from '../controller/commentController'
import tryCatchMiddleware from '../middlewares/tryCatchMiddleware'

const router = express.Router()

router.post('/comment',tryCatchMiddleware(addComment) )

export default router