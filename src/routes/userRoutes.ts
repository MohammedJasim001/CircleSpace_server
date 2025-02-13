import express from 'express'
import { editProfile, profile, searchUsers, suggestionProfiles, toggleFollow } from '../controller/userController'
import tryCatchMiddleware from '../middlewares/tryCatchMiddleware'
import { uploadMedia } from '../middlewares/imageUploadMiddleware'


const router = express.Router()

router.get('/profile/:id',tryCatchMiddleware(profile) )
router.get('/suggestions/:id',tryCatchMiddleware(suggestionProfiles))
// router.get('/user/:id')
router.post('/follow',tryCatchMiddleware(toggleFollow))
router.get('/search',tryCatchMiddleware(searchUsers))
router.put('/editprofile/:userId',uploadMedia,tryCatchMiddleware(editProfile))

export default router