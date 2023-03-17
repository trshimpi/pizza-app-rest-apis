import Joi from 'joi';
import {  RefreshToken , User } from '../../models';
import CustomeErrorHandler from '../../services/CustomeErrorHandler';
import JwtService from '../../services/JwtService';
import bcrypt from 'bcrypt';
import { REFRESH_SECRET } from '../../config';

const loginController = {
    async login(req,res,next){

        // validation
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            })

        const {error} = loginSchema.validate(req.body);

        if(error){
            return next(error)
        }

        // check if user exists in database
        try{
            const user =await User.findOne({email:req.body.email});
            if(!user){
                return next(CustomeErrorHandler.wrongCredentials());
            }
            // compare the password
            const match = await bcrypt.compare(req.body.password , user.password);
            if(!match){
                return next(CustomeErrorHandler.wrongCredentials());
            }

            // generate token
            const access_token = JwtService.sign({_id: user._id ,role:user.role});

            const refresh_token = JwtService.sign({ _id : user._id , role: user.role},'1y', REFRESH_SECRET);

            // store refresh token in database
            await RefreshToken.create({ token: refresh_token });

            return res.json({access_token ,refresh_token });

        }catch(err){
            return next(err);
        }

      
    },

    async logout(req,res,next){

        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
            })

        const {error} = refreshSchema.validate(req.body);

        if(error){
            return next(error)
        }

        try{
            await RefreshToken.deleteOne({ token:req.body.refresh_token });
        }catch(err){
            return next(new Error('Something went wrong with the database'))
        }

        res.json({msg:"Logged Out!!!"});
    }
}

export default loginController;