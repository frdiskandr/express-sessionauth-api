import ResponseError from "../Error/ResponseError.js"

const ErrorMiddleware = async (err, req , res , next) => {
    const code = err.statusCode || 500;
    if(err instanceof ResponseError){
        res.status(code).json({
            success: false,
            code,
            message: err.message
        })
        return
    }
     res.status(code).json({
            success: false,
            code,
            message: "internal server error"
        })
}

export default ErrorMiddleware;