import { User } from "../../models";
import CustomeErrorHandler from "../../services/CustomeErrorHandler";

const userController = {
    async me(req,res,next){
        try{
            const user = await User.findOne({ _id : req.user._id}).select('-password -updatedAt -__v');
            if(!user){
                return next(CustomeErrorHandler.notFound());
            }
            res.json(user);
        }catch(err){
            console.log(err);
            return next(err);
        }
        
    }
}

export default userController;