import express from 'express'
import { addComment } from '../controller/commentController'

const router = express.Router()

router.post('/comment',addComment)

export default router