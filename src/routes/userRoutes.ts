import express from 'express'
import { profile, suggestionProfiles, toggleFollow } from '../controller/userController'


const router = express.Router()

router.get('/profile/:id',profile)
router.get('/suggestions/:id',suggestionProfiles)
// router.get('/user/:id')
router.post('/follow',toggleFollow)

export default router