import CustomeErrorHandler from '../services/CustomeErrorHandler';
import JwtService from '../services/JwtService';

const authorizationMiddleware = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(CustomeErrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];

    try {
        const { _id, role } = await JwtService.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();

    } catch(err) {
        return next(CustomeErrorHandler.unAuthorized());
    }

}

export default authorizationMiddleware;