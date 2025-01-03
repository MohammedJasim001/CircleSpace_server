import express from 'express'
import { profile, searchUsers, suggestionProfiles, toggleFollow } from '../controller/userController'
import tryCatchMiddleware from '../middlewares/tryCatchMiddleware'


const router = express.Router()

router.get('/profile/:id',tryCatchMiddleware(profile) )
router.get('/suggestions/:id',tryCatchMiddleware(suggestionProfiles))
// router.get('/user/:id')
router.post('/follow',tryCatchMiddleware(toggleFollow))
router.get('/search',tryCatchMiddleware(searchUsers))

export default router