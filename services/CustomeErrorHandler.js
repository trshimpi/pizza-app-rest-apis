class CustomeErrorHandler extends Error {
    constructor(status , msg){
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message){
        return new CustomeErrorHandler(409 , message);
    }

    static wrongCredentials(message = 'username or password is incorrect'){
        return new CustomeErrorHandler(401 , message);
    }

    static unAuthorized(message = 'unAuthorized'){
        return new CustomeErrorHandler(401 , message);
    }

    static notFound(message = '404 notFound'){
        return new CustomeErrorHandler(404 , message);
    }

    static serverError(message = 'Internal server error'){
        return new CustomeErrorHandler(500 , message);
    }

}

export default CustomeErrorHandler;