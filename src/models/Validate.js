import ResponseError from "../Error/ResponseError.js";

async function ValidateSchema(schema, data) {
    try{
        const valid = await schema.validate(data);
        return valid
    }catch(e){
        console.log(e)
        throw new ResponseError(`validation error: ${e.errors}`, 400);
    }
}

export {ValidateSchema}