import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../models";
import CustomeErrorHandler from "../../services/CustomeErrorHandler";
import JwtService from "../../services/JwtService";

const refreshController = {
     async refresh(req, res, next){
        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
            })

        const {error} = refreshSchema.validate(req.body);

        if(error){
            return next(error)
        }

        // check if refreshtoken is present in database
        let refreshtoken;
        try{
            refreshtoken = await RefreshToken.findOne({ token : req.body.refresh_token });
            if(!refreshtoken){
                return next(CustomeErrorHandler.unAuthorized('Invalid refresh token'));
            }

            let userId;
            // verify refresh token
            try{
                const { _id } = await JwtService.verify(refreshtoken.token , REFRESH_SECRET);
                userId = _id;
            }catch(err){
                return next(CustomeErrorHandler.unAuthorized('Invalid refresh token'));
            }

            // check if user mentioned in payload of refreshtoken exists in database
            const user = await User.findOne({ _id:userId});
            if(!user){
                return next(CustomeErrorHandler.unAuthorized('No user found.'));
            }

            // generate token
            const access_token = JwtService.sign({_id: user._id ,role:user.role});

            const refresh_token = JwtService.sign({ _id : user._id , role: user.role},'1y', REFRESH_SECRET);

            // store refresh token in database
            await RefreshToken.create({ token: refresh_token });
            res.json({ access_token , refresh_token });

        }catch(err){
            return next(new Error('something went wrong' + err.message))
        }
    }
};

export default refreshController;