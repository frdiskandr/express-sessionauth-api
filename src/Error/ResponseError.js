class ResponseError extends Error{
    constructor(code, msg){
        super(msg),
        this.statusCode = code
    }
}

export default ResponseError;