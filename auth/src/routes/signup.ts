import express, {Request, Response} from "express";
import { body } from 'express-validator'
import {ValidateRequest, BadRequestError} from '@hursunss/common'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post('/api/users/signup',
    [body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 5, max: 20 }).withMessage('password must be between 5 and 20 character')]
  ,ValidateRequest,
  async (req: Request, res: Response) => {
    
        const { email, password } = req.body
        
        const existingUser = await User.findOne({ email })
        
        if (existingUser) {
           throw new BadRequestError('email in use')
        }

        const user = User.build({ email, password })
      await user.save()
      //Generate JWT
      const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
      }, process.env.JWT_KEY!)

      req.session = {
        jwt: userJwt,
      }

      res.status(201).send(user)
    
})

export {router as signupRouter}