import { User } from "../models"
import CustomeErrorHandler from "../services/CustomeErrorHandler";

const adminMiddleware = async (req,res,next) => {
    try{
        const user = await User.findOne({ _id:req.user._id});
        if( user.role === 'admin' ){
            next();
        }else{
            return next(CustomeErrorHandler.unAuthorized("You are not admin"));
        }
    }catch(err){
        return next(CustomeErrorHandler.serverError())
    }
}

export default adminMiddleware;