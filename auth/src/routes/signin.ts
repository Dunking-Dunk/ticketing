import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { body } from 'express-validator'
import { User } from "../models/user";
import { ValidateRequest, BadRequestError } from '@hursunss/common'
import { Password } from "../services/password";

const router = express.Router();

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('email must be valid'),
    body('password').trim().notEmpty().withMessage('you must apply a password')
], ValidateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body
        
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            throw new BadRequestError('Invalid Credentials')
        }
        const passwordMatch = await Password.compare(existingUser.password, password)
       
        if (!passwordMatch) {
            throw new BadRequestError('Invalid Credentials')
        }

        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
          }, process.env.JWT_KEY!)
    
          req.session = {
            jwt: userJwt,
          }
    
          res.status(200).send(existingUser)
})

export {router as signinRouter}