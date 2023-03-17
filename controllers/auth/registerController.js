import Joi from 'joi';
import CustomeErrorHandler from '../../services/CustomeErrorHandler';
import { RefreshToken, User } from '../../models';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
import { REFRESH_SECRET } from '../../config';

const registerController = {
    async register(req,res,next){

        // validate the request using Joi
        const registerSchema = Joi.object({
            name:Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password : Joi.ref('password')
        });

        const { error } = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }
        
        // check if user is already in database
        try{
            const exist = await (User.exists({email: req.body.email}));
            if(exist){
                return next(CustomeErrorHandler.alreadyExist('This email is already taken.'));

            }
        }catch(err){
            return next(err);
        }
        const { name , email, password } = req.body;
        // hash password
        const hashedPassword = await bcrypt.hash(password ,10);

        
        // prepare the user model
        const user = new User({
            name  ,
            email ,
            password : hashedPassword 
        }) 

        let access_token;
        let refresh_token;
        try{
            const result = await user.save();
            //  create jwt token
            access_token = JwtService.sign({ _id : result._id , role: result.role});
            refresh_token = JwtService.sign({ _id : result._id , role: result.role},'1y', REFRESH_SECRET);

            // store refresh token in database
            await RefreshToken.create({ token: refresh_token });
        }catch(err){
            return next(err);
        }

        return res.json({ access_token , refresh_token });
    }
}

export default registerController;