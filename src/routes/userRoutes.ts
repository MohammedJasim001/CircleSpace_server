import express from 'express'
import { profile, suggestionProfiles } from '../controller/userController'


const router = express.Router()

router.get('/profile/:id',profile)
router.get('/suggestions/:id',suggestionProfiles)
router.get('/user/:id')

export default router